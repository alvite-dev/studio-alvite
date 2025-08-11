'use client';

import { useState } from 'react';
import { Search, Download, ExternalLink, Home, MapPin, Ruler, Car, Bed, Bath, Loader2 } from 'lucide-react';
import PageHeader from '@/components/PageHeader';

interface PropertyData {
  id: string;
  title: string;
  price: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  description: string;
  features: string[];
  images: string[];
  url: string;
  propertyType: string;
  condominiumFee: string;
  iptu: string;
  totalCost: string;
  pricePerSqm: string;
  buildingAge: string;
  floor: string;
  totalFloors: string;
  furnished: boolean;
  petFriendly: boolean;
  contact: {
    name: string;
    phone: string;
    email: string;
  };
}

export default function ScrappingPage() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [property, setProperty] = useState<PropertyData | null>(null);
  const [error, setError] = useState('');

  const handleScrapping = async () => {
    if (!url.trim()) {
      setError('Por favor, insira uma URL válida');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Aqui será implementada a lógica de scrapping
      // Por enquanto, vamos simular dados mockados de um imóvel específico
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockData: PropertyData = {
        id: '1',
        title: 'Apartamento Alto Padrão na Vila Madalena',
        price: 'R$ 850.000',
        address: 'Rua Harmonia, 1234',
        neighborhood: 'Vila Madalena',
        city: 'São Paulo',
        state: 'SP',
        area: '85m²',
        bedrooms: 3,
        bathrooms: 2,
        parkingSpaces: 1,
        description: 'Apartamento reformado com acabamentos de primeira qualidade. Localização privilegiada na Vila Madalena, próximo a restaurantes, bares e estações de metrô. Condomínio com área de lazer completa incluindo piscina, academia, salão de festas e espaço gourmet. Unidade com varanda integrada, cozinha planejada e dormitórios com armários embutidos.',
        features: [
          'Varanda integrada',
          'Cozinha planejada',
          'Armários embutidos',
          'Piscina',
          'Academia',
          'Salão de festas',
          'Espaço gourmet',
          'Portaria 24h',
          'Elevador',
          'Interfone'
        ],
        images: [],
        url: url,
        propertyType: 'Apartamento',
        condominiumFee: 'R$ 650',
        iptu: 'R$ 180',
        totalCost: 'R$ 830',
        pricePerSqm: 'R$ 10.000',
        buildingAge: '8 anos',
        floor: '7º andar',
        totalFloors: '12 andares',
        furnished: false,
        petFriendly: true,
        contact: {
          name: 'João Silva - Corretor',
          phone: '(11) 99999-1234',
          email: 'joao.silva@imobiliaria.com'
        }
      };

      setProperty(mockData);
    } catch (err) {
      setError('Erro ao fazer scrapping da página. Verifique se a URL está correta.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = () => {
    if (!property) return;

    const csvContent = [
      ['Campo', 'Valor'],
      ['Título', property.title],
      ['Preço', property.price],
      ['Endereço', property.address],
      ['Bairro', property.neighborhood],
      ['Cidade', property.city],
      ['Estado', property.state],
      ['Área', property.area],
      ['Quartos', property.bedrooms.toString()],
      ['Banheiros', property.bathrooms.toString()],
      ['Vagas', property.parkingSpaces.toString()],
      ['Tipo', property.propertyType],
      ['Condomínio', property.condominiumFee],
      ['IPTU', property.iptu],
      ['Custo Total', property.totalCost],
      ['Preço/m²', property.pricePerSqm],
      ['Idade do Imóvel', property.buildingAge],
      ['Andar', property.floor],
      ['Total de Andares', property.totalFloors],
      ['Mobiliado', property.furnished ? 'Sim' : 'Não'],
      ['Aceita Pet', property.petFriendly ? 'Sim' : 'Não'],
      ['Contato - Nome', property.contact.name],
      ['Contato - Telefone', property.contact.phone],
      ['Contato - Email', property.contact.email],
      ['Características', property.features.join('; ')],
      ['Descrição', property.description],
      ['URL', property.url]
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `imovel-${property.id}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="h-screen flex flex-col">
      <PageHeader
        title="Web Scrapping"
        description="Extraia dados completos de anúncios específicos de imóveis"
        action={property && (
          <button
            onClick={handleExportData}
            className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Exportar CSV</span>
          </button>
        )}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Column - Input */}
        <div className="w-full lg:w-96 bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-200 p-4 sm:p-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-slate-700 mb-2">
                URL da página de listagem
              </label>
              <div className="space-y-3">
                <input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.vivareal.com.br/venda/..."
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  disabled={isLoading}
                />
                <button
                  onClick={handleScrapping}
                  disabled={isLoading || !url.trim()}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processando...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      <span>Iniciar Scrapping</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Sites Suportados</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• VivaReal</li>
                <li>• ZAP Imóveis</li>
                <li>• Imovelweb</li>
                <li>• OLX Imóveis</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-yellow-900 mb-2">Dica</h3>
              <p className="text-sm text-yellow-800">
                Cole a URL de um anúncio específico de imóvel para extrair todos os dados detalhados.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Results */}
        <div className="flex-1 bg-white overflow-hidden flex flex-col">
          {!property && !isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Home className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">Nenhum imóvel extraído</h3>
                <p className="text-slate-500">
                  Cole o link de um anúncio específico para extrair os dados completos
                </p>
              </div>
            </div>
          ) : property ? (
            <div className="flex-1 overflow-auto">
              {/* Property Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200 p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">{property.title}</h2>
                    <div className="flex items-center text-slate-600 mb-2">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span className="text-lg">{property.address}, {property.neighborhood}</span>
                    </div>
                    <div className="text-slate-600">
                      {property.city} - {property.state}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600 mb-1">{property.price}</div>
                    <div className="text-slate-600">{property.pricePerSqm}/m²</div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Main Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-slate-50 rounded-lg p-4 text-center">
                    <Ruler className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                    <div className="text-2xl font-bold text-slate-900">{property.area}</div>
                    <div className="text-sm text-slate-600">Área Total</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4 text-center">
                    <Bed className="w-8 h-8 mx-auto text-green-600 mb-2" />
                    <div className="text-2xl font-bold text-slate-900">{property.bedrooms}</div>
                    <div className="text-sm text-slate-600">Quartos</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4 text-center">
                    <Bath className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                    <div className="text-2xl font-bold text-slate-900">{property.bathrooms}</div>
                    <div className="text-sm text-slate-600">Banheiros</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4 text-center">
                    <Car className="w-8 h-8 mx-auto text-orange-600 mb-2" />
                    <div className="text-2xl font-bold text-slate-900">{property.parkingSpaces}</div>
                    <div className="text-sm text-slate-600">Vagas</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Property Details */}
                    <div className="bg-white border border-slate-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">Detalhes do Imóvel</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-600">Tipo:</span>
                          <div className="font-medium text-slate-900">{property.propertyType}</div>
                        </div>
                        <div>
                          <span className="text-slate-600">Idade:</span>
                          <div className="font-medium text-slate-900">{property.buildingAge}</div>
                        </div>
                        <div>
                          <span className="text-slate-600">Andar:</span>
                          <div className="font-medium text-slate-900">{property.floor}</div>
                        </div>
                        <div>
                          <span className="text-slate-600">Total Andares:</span>
                          <div className="font-medium text-slate-900">{property.totalFloors}</div>
                        </div>
                        <div>
                          <span className="text-slate-600">Mobiliado:</span>
                          <div className="font-medium text-slate-900">{property.furnished ? 'Sim' : 'Não'}</div>
                        </div>
                        <div>
                          <span className="text-slate-600">Aceita Pet:</span>
                          <div className="font-medium text-slate-900">{property.petFriendly ? 'Sim' : 'Não'}</div>
                        </div>
                      </div>
                    </div>

                    {/* Cost Breakdown */}
                    <div className="bg-white border border-slate-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">Custos Mensais</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-slate-100">
                          <span className="text-slate-600">Condomínio</span>
                          <span className="font-medium text-slate-900">{property.condominiumFee}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-100">
                          <span className="text-slate-600">IPTU</span>
                          <span className="font-medium text-slate-900">{property.iptu}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-t-2 border-slate-200 font-semibold">
                          <span className="text-slate-900">Total Mensal</span>
                          <span className="text-lg text-blue-600">{property.totalCost}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Description */}
                    <div className="bg-white border border-slate-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">Descrição</h3>
                      <p className="text-slate-700 leading-relaxed">{property.description}</p>
                    </div>

                    {/* Features */}
                    <div className="bg-white border border-slate-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">Características</h3>
                      <div className="grid grid-cols-1 gap-2">
                        {property.features.map((feature, index) => (
                          <div key={index} className="flex items-center py-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                            <span className="text-slate-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">Informações de Contato</h3>
                      <div className="space-y-2">
                        <div className="font-medium text-slate-900">{property.contact.name}</div>
                        <div className="text-slate-700">{property.contact.phone}</div>
                        <div className="text-slate-700">{property.contact.email}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-slate-200">
                  <a
                    href={property.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span>Ver Anúncio Original</span>
                  </a>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}