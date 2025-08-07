export default function Planilha() {
  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Lista de Imóveis</h1>
            <p className="text-sm text-slate-600 mt-1">
              Planilha de controle e análise de investimentos imobiliários
            </p>
          </div>
          <a
            href="https://docs.google.com/spreadsheets/d/11xlI2KUYztjP--cco6Wk8BCXZXcGKFp_ofZ91iFgYGM/edit?gid=1261042544#gid=1261042544"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Abrir no Google Sheets
          </a>
        </div>
      </div>

      {/* Iframe Container */}
      <div className="flex-1 bg-white">
        <iframe
          src="https://docs.google.com/spreadsheets/d/11xlI2KUYztjP--cco6Wk8BCXZXcGKFp_ofZ91iFgYGM/edit?usp=sharing&gid=1261042544&single=true&widget=true&headers=false"
          className="w-full h-full border-0"
          title="Lista de Imóveis - Studio Alvite"
        />
      </div>
    </div>
  );
}