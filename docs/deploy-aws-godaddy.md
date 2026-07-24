# Deploy paso a paso: fondi-landing en AWS + dominio GoDaddy

Reemplazá `<DOMINIO>` por tu dominio real (ej. `fondi.com.ar`) y `<BUCKET>` por el nombre de bucket que elijas (debe ser único a nivel global en S3) en todos los comandos.

## 0. (Recomendado) Usuario IAM en vez de root

Ahora mismo la CLI está autenticada como **root** de la cuenta (`arn:aws:iam::872364107685:root`). Root tiene poder total sin límites — si se filtran esas credenciales, comprometen todo. Antes de seguir, conviene crear un usuario IAM acotado a lo que este deploy necesita:

```bash
aws iam create-user --user-name fondi-deploy

cat > fondi-deploy-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:*",
        "cloudfront:*",
        "acm:*",
        "lambda:*",
        "ses:*",
        "iam:CreateRole",
        "iam:AttachRolePolicy",
        "iam:PassRole"
      ],
      "Resource": "*"
    }
  ]
}
EOF

aws iam put-user-policy --user-name fondi-deploy --policy-name fondi-deploy-policy --policy-document file://fondi-deploy-policy.json
aws iam create-access-key --user-name fondi-deploy
```

El último comando te devuelve `AccessKeyId` y `SecretAccessKey`. Configurá un profile nuevo:

```bash
aws configure --profile fondi-deploy
# pegás el AccessKeyId y SecretAccessKey que te dio el comando anterior
```

Y en todos los comandos de este documento agregá `--profile fondi-deploy` (o exportá `export AWS_PROFILE=fondi-deploy` una sola vez en la terminal).

## 1. Dominio en GoDaddy

1. Entrá a [godaddy.com](https://godaddy.com), buscá el dominio deseado.
2. Agregalo al carrito y completá la compra (podés desactivar la renovación automática si no querés que se cobre solo).
3. Una vez comprado, entrá a **Mis Productos → tu dominio → DNS** — ahí vamos a volver en el paso 6.

## 2. Bucket S3

```bash
aws s3api create-bucket --bucket <BUCKET> --region us-east-1

aws s3api put-public-access-block --bucket <BUCKET> --public-access-block-configuration \
  BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
```

Si usás una región distinta a `us-east-1`, agregá `--create-bucket-configuration LocationConstraint=<tu-region>` al primer comando.

## 3. Certificado SSL (ACM) — obligatorio en us-east-1 para CloudFront

```bash
aws acm request-certificate \
  --domain-name <DOMINIO> \
  --subject-alternative-names www.<DOMINIO> \
  --validation-method DNS \
  --region us-east-1
```

Guardá el ARN que te devuelve. Después pedí los registros de validación:

```bash
aws acm describe-certificate --certificate-arn <ARN_DEL_CERT> --region us-east-1
```

Buscá `ResourceRecord` (hay uno por cada dominio: `<DOMINIO>` y `www.<DOMINIO>`) — cada uno tiene `Name` y `Value`. Esos van como registros **CNAME** en el DNS de GoDaddy (paso 1.3). Después de agregarlos, esperá y confirmá que el estado pase a `ISSUED`:

```bash
aws acm describe-certificate --certificate-arn <ARN_DEL_CERT> --region us-east-1 --query 'Certificate.Status'
```

## 4. Distribución CloudFront (por consola — más simple que armar el JSON a mano)

1. AWS Console → CloudFront → **Create distribution**.
2. **Origin domain**: elegí el bucket S3 del paso 2.
3. **Origin access**: "Origin access control settings (recommended)" → **Create control setting** → dejá los defaults → Create.
4. **Viewer → Viewer protocol policy**: Redirect HTTP to HTTPS.
5. **Settings → Alternate domain name (CNAME)**: agregá `<DOMINIO>` y `www.<DOMINIO>`.
6. **Custom SSL certificate**: seleccioná el certificado ACM del paso 3.
7. **Default root object**: `index.html`.
8. Click **Create distribution**.
9. Después de creada, CloudFront muestra un botón para **copiar la bucket policy generada** — vas al bucket S3 → **Permissions → Bucket policy** → pegás esa policy (ya viene lista, no hace falta escribirla).
10. En la distribución, ir a **Error pages → Create custom error response**: agregar dos, una para HTTP 403 y otra para HTTP 404, ambas apuntando a `/index.html` con **Response code 200**.
11. Esperá a que el estado pase de `Deploying` a `Deployed` (5-15 min) y copiá el **Distribution domain name** (`dxxxxxxxxxxxxx.cloudfront.net`).

## 5. Build y subida del sitio

```bash
cd /Users/carlosvelasco/Documents/fondi-landing
pnpm build
aws s3 sync dist/ s3://<BUCKET> --delete
aws cloudfront create-invalidation --distribution-id <DISTRIBUTION_ID> --paths "/*"
```

Este bloque es el que vas a repetir cada vez que quieras actualizar el sitio (sin CI/CD, manual).

## 6. DNS en GoDaddy

En **Mis Productos → tu dominio → DNS**:

1. **Add record** → Type `CNAME`, Name `www`, Value `dxxxxxxxxxxxxx.cloudfront.net` (el del paso 4.11), TTL 1 hora.
2. Ir a la sección **Forwarding** del dominio → **Add forwarding**:
   - Forward to: `https://www.<DOMINIO>`
   - Redirect type: **Permanent (301)**
   - Settings: **Forward only** (sin masking)

El dominio raíz (apex, sin `www`) no puede llevar un CNAME directo a CloudFront — es una regla de DNS, no una limitación de GoDaddy. Por eso el apex redirige a `www` en vez de apuntar directo.

## 7. Verificación

```bash
dig www.<DOMINIO>
curl -I https://www.<DOMINIO>
curl -I https://<DOMINIO>
```

- El primer `curl` debe devolver `200` con headers de CloudFront (`x-cache`, `via`).
- El segundo debe devolver un `301`/`302` hacia `https://www.<DOMINIO>`.
- Confirmá en el navegador que el candado SSL es válido para ambos.

La propagación de DNS puede tardar entre minutos y un par de horas.
