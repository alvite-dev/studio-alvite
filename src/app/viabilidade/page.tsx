export default function Viabilidade() {
  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-slate-200 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">Análise de Viabilidade</h1>
            <p className="text-sm text-slate-600 mt-1">
              Ferramenta de análise financeira para investimentos imobiliários
            </p>
          </div>
          <a
            href="https://docs.google.com/spreadsheets/d/1Gpey0StqAEQNbEl09dDY2PQzjju9Gi2WoUsTC2oXK60/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            Abrir no Google Sheets
          </a>
        </div>
      </div>

      {/* Iframe Container */}
      <div className="flex-1 bg-white">
        <iframe
          src="https://docs.google.com/spreadsheets/d/1Gpey0StqAEQNbEl09dDY2PQzjju9Gi2WoUsTC2oXK60/edit?usp=sharing&single=true&widget=true&headers=false"
          className="w-full h-full border-0"
          title="PAC - Análise de Viabilidade - Studio Alvite"
        />
      </div>
    </div>
  );
}