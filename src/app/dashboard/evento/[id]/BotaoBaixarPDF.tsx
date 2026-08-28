'use client';

import { useState } from 'react';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';

export default function BotaoBaixarPDF({ url, nomeEvento }: { url: string, nomeEvento: string }) {
  const [carregando, setCarregando] = useState(false);

  const gerarPDF = async () => {
    try {
      setCarregando(true);

      // 1. Cria um documento A4 (Retrato, milímetros)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // 2. Cores da sua marca
      const corTexto = '#18181b'; // Preto suave
      const corSecundaria = '#71717a'; // Cinza

      // 3. Desenha uma borda esmeralda elegante em volta da página
      pdf.setDrawColor(16, 185, 129); // Verde Emerald 500 do Tailwind
      pdf.setLineWidth(1.5);
      pdf.roundedRect(10, 10, 190, 277, 5, 5, 'S');

      // 4. Título da Festa
      pdf.setTextColor(corTexto);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(28);
      pdf.text(nomeEvento, 105, 40, { align: 'center' });

      // 5. Subtítulo
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(16);
      pdf.setTextColor(corSecundaria);
      pdf.text('Compartilhe seus melhores momentos conosco!', 105, 52, { align: 'center' });

      // 6. Gera o QR Code em alta resolução (Sem fundos cinzas, puramente P&B)
      const qrDataUrl = await QRCode.toDataURL(url, {
        errorCorrectionLevel: 'H', // Alta tolerância a erros (fácil de ler)
        margin: 1,
        width: 800,
        color: { dark: '#000000', light: '#ffffff' }
      });

      // 7. Adiciona o QR Code no centro da página A4
      // (105mm é o meio. Se a imagem tem 100mm, começa no 55mm para ficar centrado)
      pdf.addImage(qrDataUrl, 'PNG', 55, 75, 100, 100);

      // 8. Título das Instruções
      pdf.setTextColor('#10b981'); // Verde Emerald
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(20);
      pdf.text('COMO FUNCIONA:', 105, 200, { align: 'center' });

      // 9. Instruções passo a passo
      pdf.setTextColor(corTexto);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(16);
      pdf.text('1. Aponte a câmera do seu celular para o QR Code', 105, 215, { align: 'center' });
      pdf.text('2. Tire sua foto ou escolha da galeria', 105, 225, { align: 'center' });
      pdf.text('3. Olhe para o telão e veja a mágica!', 105, 235, { align: 'center' });

      // 10. Rodapé com a sua marca
      pdf.setTextColor(161, 161, 170); 
      pdf.setFontSize(10);
      pdf.text('Criado com FlashFest', 105, 280, { align: 'center' });

      // 11. Salva o arquivo no computador do cliente
      const nomeArquivo = `Placa_Mesa_${nomeEvento.replace(/\s+/g, '_')}.pdf`;
      pdf.save(nomeArquivo);

    } catch (error) {
      console.error('Erro ao gerar o PDF:', error);
      alert('Ocorreu um erro ao gerar a placa. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <button
      onClick={gerarPDF}
      disabled={carregando}
      className="mt-4 w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-lg transition disabled:opacity-50"
    >
      {carregando ? '⏳ Gerando Placa...' : '📄 Baixar Placa de Mesa (PDF)'}
    </button>
  );
}