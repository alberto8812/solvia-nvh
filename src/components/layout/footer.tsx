import { useState } from "react";
import { contact, coverage } from "@/data";
import { Icon } from "@/components/ui/icon";
import { Container } from "@/components/ui";
import { ComplianceModal } from "@/components/compliance-modal";

const FOOTER_LEGAL_LINKS = [
  { label: "Política de Privacidade", docId: "privacidade-dados" },
  { label: "Compliance e Regulatório", docId: "seguranca-informacao" },
  { label: "Cookies", docId: "cookies" },
  { label: "Segurança Cibernética", docId: "seguranca-cibernetica" },
  { label: "PLDFT", docId: "pldft" },
];

export function Footer() {
  const year = new Date().getFullYear();
  const [openDocId, setOpenDocId] = useState<string | null>(null);
  return (
    <footer
      className="bg-brand-900 text-brand-300"
      style={{ paddingTop: "60px" }}
    >
      {/* Brand anchors the grid — 1.2fr vs 1fr keeps it from reading as a
          5th equal nav column. Institucional is a real 4th column, not
          fine print, since CNPJ/BCB/Ouvidoria are compliance data a
          regulated lender exhibits at the same weight as its contact info. */}
      <Container className="pb-10 border-b border-brand-800">
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr_1fr_1.1fr] gap-8 md:gap-12">
          {/* Brand */}
          <div>
            <img
              src="/images/balck-logo.png"
              alt="Solvia"
              className="h-15 w-auto object-contain"
            />
            <p className="font-serif italic text-[19px] mt-[18px] max-w-[340px] leading-[1.45] text-brand-200">
              Estamos disponíveis para te apoiar quando você mais precisar. Te
              convidamos a nos seguir nas redes sociais:
            </p>
            <div className="flex gap-3 mt-5">
              <a
                href={contact.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram @solvia_brasil"
                className="flex items-center justify-center w-11 h-11 rounded-full border border-brand-300/30 text-brand-200 transition-colors hover:bg-on-brand hover:border-on-brand hover:text-brand-900"
              >
                <Icon name="instagram" size={22} />
              </a>
              <a
                href={contact.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Solvia Brasil"
                className="flex items-center justify-center w-11 h-11 rounded-full border border-brand-300/30 text-brand-200 transition-colors hover:bg-on-brand hover:border-on-brand hover:text-brand-900"
              >
                <Icon name="facebook" size={22} />
              </a>
            </div>
          </div>

          {/* Localidades */}
          <div>
            <div className="font-mono text-[11.5px] tracking-[.14em] uppercase mb-4 text-brand-500">
              Onde atuamos
            </div>
            <div className="flex flex-col gap-2.5 text-[14.5px] text-brand-200">
              {coverage.locations.map((loc) => (
                <span key={loc.city} className="flex items-center gap-2">
                  <Icon
                    name="map-pin"
                    size={14}
                    className="shrink-0 text-brand-500"
                  />
                  {loc.city}, {loc.region}
                </span>
              ))}
            </div>
          </div>

          {/* Contato — icon-led, mirrors the Localidades pattern */}
          <div>
            <div className="font-mono text-[11.5px] tracking-[.14em] uppercase mb-4 text-brand-500">
              Contato
            </div>
            <div className="flex flex-col gap-2.5 text-[14.5px] text-brand-200">
              <a
                href={contact.telHref}
                className="flex items-center gap-2 no-underline hover:text-on-brand transition-colors text-brand-200"
              >
                <Icon
                  name="phone"
                  size={14}
                  className="shrink-0 text-brand-500"
                />
                {contact.phone}
              </a>
              <span className="flex items-center gap-2">
                <Icon
                  name="mail"
                  size={14}
                  className="shrink-0 text-brand-500"
                />
                {contact.email}
              </span>
              <a
                href={`https://wa.me/${contact.waNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 no-underline hover:text-on-brand transition-colors text-brand-200"
              >
                <Icon
                  name="chat"
                  size={14}
                  className="shrink-0 text-brand-500"
                />
                WhatsApp →
              </a>
            </div>
            <div className="flex flex-col gap-2 text-[13.5px]">
              {contact.cnpj && (
                <div className="flex gap-1.5">
                  <span className="text-brand-600">CNPJ:</span>
                  <span className="tabular-nums">{contact.cnpj}</span>
                </div>
              )}
              {contact.ombudsmanEmail && (
                <div className="flex gap-1.5">
                  <span className="text-brand-600">Ouvidoria:</span>
                  <span>{contact.ombudsmanEmail}</span>
                </div>
              )}
              {contact.sacPhone && (
                <div className="flex gap-1.5">
                  <span className="text-brand-600">SAC:</span>
                  <span className="tabular-nums">{contact.sacPhone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Institucional — compliance data at the same weight as the
              other columns, not demoted to bottom-of-page fine print. */}
          <div>
            <div className="font-mono text-[11.5px] tracking-[.14em] uppercase mb-4 text-brand-500">
              Legal
            </div>
            <div className="flex flex-col gap-3 text-[14.5px] text-brand-200">
              {contact.bcbNotice && contact.bcbLink && (
                <a
                  href={contact.bcbLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 no-underline hover:border-brand-600 hover:text-on-brand transition-colors text-brand-300 text-[13px] leading-snug border border-brand-700 rounded-md px-2.5 py-2"
                >
                  <Icon name="shield" size={15} className="shrink-0 mt-0.5" />
                  {contact.bcbNotice}
                </a>
              )}
              <div className="flex gap-3 flex-wrap text-[13px] pt-1">
                {FOOTER_LEGAL_LINKS.map(({ label, docId }) => (
                  <button
                    key={docId}
                    type="button"
                    onClick={() => setOpenDocId(docId)}
                    className="bg-transparent border-0 p-0 cursor-pointer no-underline hover:text-on-brand transition-colors text-brand-500"
                  >
                    {label}
                  </button>
                ))}
              </div>
              {contact.cetNotice && (
                <span className="text-[12.5px] text-brand-600 leading-snug">
                  {contact.cetNotice}
                </span>
              )}
            </div>
          </div>
        </div>
      </Container>

      {/* Bottom line */}
      <Container className="py-6 flex justify-between flex-wrap gap-3 text-[12.5px] text-brand-500">
        <span>© {year} Solvia · Todos os direitos reservados</span>
        <span>Créditos sujeitos a avaliação</span>
      </Container>

      <ComplianceModal
        documentId={openDocId}
        onClose={() => setOpenDocId(null)}
      />
    </footer>
  );
}
