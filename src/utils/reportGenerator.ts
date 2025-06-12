import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { InterviewResult } from '../types/interview';

export const generatePDFReport = async (results: InterviewResult) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 20;

  // Helper function to add text with word wrapping
  const addText = (text: string, x: number, y: number, maxWidth: number, fontSize = 12) => {
    pdf.setFontSize(fontSize);
    const lines = pdf.splitTextToSize(text, maxWidth);
    pdf.text(lines, x, y);
    return y + (lines.length * fontSize * 0.4);
  };

  // Header
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Interview Performance Report', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Generated on: ${results.completedAt.toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 20;

  // Overall Score Section
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Overall Performance', 20, yPosition);
  yPosition += 10;

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  const overallScore = Math.round(results.overallScore * 100);
  yPosition = addText(`Overall Score: ${overallScore}%`, 20, yPosition, pageWidth - 40);
  yPosition = addText(`Questions Answered: ${results.answers.length} of ${results.questions.length}`, 20, yPosition, pageWidth - 40);
  yPosition = addText(`Interview Duration: ${Math.round(results.duration / 60000)} minutes`, 20, yPosition, pageWidth - 40);
  yPosition = addText(`Domain: ${results.config.domain.replace('-', ' ').toUpperCase()}`, 20, yPosition, pageWidth - 40);
  yPosition = addText(`Difficulty: ${results.config.difficulty.toUpperCase()}`, 20, yPosition, pageWidth - 40);
  yPosition += 15;

  // Performance Metrics
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Performance Breakdown', 20, yPosition);
  yPosition += 10;

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  
  const avgConfidence = Math.round(results.answers.reduce((sum, a) => sum + a.confidence, 0) / results.answers.length * 100);
  const avgKeywords = Math.round(results.answers.reduce((sum, a) => sum + a.keywordScore, 0) / results.answers.length * 100);
  const avgFluency = Math.round(results.answers.reduce((sum, a) => sum + a.fluencyScore, 0) / results.answers.length * 100);

  yPosition = addText(`Average Confidence: ${avgConfidence}%`, 20, yPosition, pageWidth - 40);
  yPosition = addText(`Keyword Usage: ${avgKeywords}%`, 20, yPosition, pageWidth - 40);
  yPosition = addText(`Fluency Score: ${avgFluency}%`, 20, yPosition, pageWidth - 40);
  yPosition += 15;

  // Strengths
  if (results.strengths.length > 0) {
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Strengths', 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    results.strengths.forEach((strength, index) => {
      yPosition = addText(`• ${strength}`, 25, yPosition, pageWidth - 50);
      yPosition += 5;
    });
    yPosition += 10;
  }

  // Areas for Improvement
  if (results.improvements.length > 0) {
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Areas for Improvement', 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    results.improvements.forEach((improvement, index) => {
      yPosition = addText(`• ${improvement}`, 25, yPosition, pageWidth - 50);
      yPosition += 5;
    });
    yPosition += 15;
  }

  // Question Details
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Question Analysis', 20, yPosition);
  yPosition += 10;

  results.questions.forEach((question, index) => {
    if (yPosition > pageHeight - 60) {
      pdf.addPage();
      yPosition = 20;
    }

    const answer = results.answers.find(a => a.questionId === question.id);
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    yPosition = addText(`Q${index + 1}: ${question.text}`, 20, yPosition, pageWidth - 40, 12);
    yPosition += 5;

    if (answer) {
      pdf.setFont('helvetica', 'normal');
      const scores = `Confidence: ${Math.round(answer.confidence * 100)}% | Keywords: ${Math.round(answer.keywordScore * 100)}% | Fluency: ${Math.round(answer.fluencyScore * 100)}%`;
      yPosition = addText(scores, 25, yPosition, pageWidth - 50, 10);
      yPosition += 5;

      const transcript = answer.transcript.length > 200 ? answer.transcript.substring(0, 200) + '...' : answer.transcript;
      yPosition = addText(`Answer: ${transcript}`, 25, yPosition, pageWidth - 50, 10);
    } else {
      pdf.setFont('helvetica', 'italic');
      yPosition = addText('No answer provided', 25, yPosition, pageWidth - 50, 10);
    }
    yPosition += 15;
  });

  // Footer
  const totalPages = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    pdf.text('Generated by AI Interview Prep', pageWidth / 2, pageHeight - 5, { align: 'center' });
  }

  // Save the PDF
  const fileName = `interview-report-${results.completedAt.toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
};

export const generateDetailedAnalysis = (results: InterviewResult) => {
  const analysis = {
    overallPerformance: results.overallScore,
    categoryBreakdown: results.categoryScores,
    timeManagement: {
      totalDuration: results.duration,
      averageTimePerQuestion: results.duration / results.answers.length,
      questionsCompleted: results.answers.length,
      questionsSkipped: results.questions.length - results.answers.length,
    },
    communicationMetrics: {
      averageResponseLength: results.answers.reduce((sum, a) => sum + a.transcript.length, 0) / results.answers.length,
      vocabularyRichness: calculateVocabularyRichness(results.answers.map(a => a.transcript)),
      technicalTermUsage: calculateTechnicalTermUsage(results.answers, results.config.domain),
    },
    improvementPlan: generateImprovementPlan(results),
  };

  return analysis;
};

const calculateVocabularyRichness = (transcripts: string[]) => {
  const allWords = transcripts.join(' ').toLowerCase().split(/\s+/);
  const uniqueWords = new Set(allWords);
  return uniqueWords.size / allWords.length;
};

const calculateTechnicalTermUsage = (answers: any[], domain: string) => {
  const technicalTerms = {
    'web-development': ['html', 'css', 'javascript', 'react', 'api', 'dom', 'http'],
    'data-structures': ['array', 'linked list', 'stack', 'queue', 'tree', 'graph', 'algorithm'],
    'system-design': ['scalability', 'load balancer', 'database', 'caching', 'microservices'],
  };

  const domainTerms = technicalTerms[domain as keyof typeof technicalTerms] || [];
  const allText = answers.map(a => a.transcript).join(' ').toLowerCase();
  
  return domainTerms.filter(term => allText.includes(term)).length / domainTerms.length;
};

const generateImprovementPlan = (results: InterviewResult) => {
  const plan = [];
  
  if (results.overallScore < 0.6) {
    plan.push('Focus on fundamental concepts in your domain');
    plan.push('Practice explaining technical concepts clearly');
  }
  
  const avgConfidence = results.answers.reduce((sum, a) => sum + a.confidence, 0) / results.answers.length;
  if (avgConfidence < 0.6) {
    plan.push('Work on building confidence through mock interviews');
    plan.push('Practice the STAR method for behavioral questions');
  }

  const avgKeywords = results.answers.reduce((sum, a) => sum + a.keywordScore, 0) / results.answers.length;
  if (avgKeywords < 0.6) {
    plan.push('Study domain-specific terminology and concepts');
    plan.push('Read technical documentation and articles');
  }

  return plan;
};