'use client';

import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { calculateEMI, formatCurrency, formatNumber, EMIResult } from '@/lib/emi';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

interface EmiCalculatorProps {
  toolName?: string;
  initialRate?: number;
}

function EmiCalculatorComponent({ toolName, initialRate = 8.5 }: EmiCalculatorProps) {
  const getInitialNumber = (key: string, fallback: number) => {
    try {
      const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
      return Number(params.get(key)) || fallback;
    } catch {
      return fallback;
    }
  };

  const [principal, setPrincipal] = useState<number>(() => getInitialNumber('principal', 2000000));
  const [annualRate, setAnnualRate] = useState<number>(() => getInitialNumber('rate', initialRate));
  const [months, setMonths] = useState<number>(() => getInitialNumber('months', 240));
  const [showSchedule, setShowSchedule] = useState<boolean>(false);
  const [showMonthly, setShowMonthly] = useState<boolean>(false);
  const [shareLink, setShareLink] = useState<string>('');
  const [showShareModal, setShowShareModal] = useState<boolean>(false);

  const result = useMemo<EMIResult>(() => {
    const monthlyRate = annualRate / 12;
    return calculateEMI(principal, annualRate, monthlyRate, months);
  }, [principal, annualRate, months]);

  const handlePrincipalChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPrincipal(Number(e.target.value) || 0);
  }, []);

  const handleRateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAnnualRate(Number(e.target.value) || 0);
  }, []);

  const handleMonthsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setMonths(Number(e.target.value) || 0);
  }, []);

  // Calculate year-wise summary
  const yearWiseSummary = useMemo(() => {
    const summary: Array<{
      year: number;
      principalPaid: number;
      interestPaid: number;
      emiPaid: number;
      endingBalance: number;
    }> = [];

    let yearStartIdx = 0;
    const yearsInLoan = Math.ceil(months / 12);

    for (let year = 1; year <= yearsInLoan; year++) {
      const yearEndIdx = Math.min(year * 12, months);
      const yearSchedule = result.schedule.slice(yearStartIdx, yearEndIdx);

      const totalPrincipal = yearSchedule.reduce((sum, row) => sum + row.principal, 0);
      const totalInterest = yearSchedule.reduce((sum, row) => sum + row.interest, 0);
      const totalEmi = yearSchedule.reduce((sum, row) => sum + row.emi, 0);
      const endingBalance = yearSchedule.length > 0 ? yearSchedule[yearSchedule.length - 1].balance : 0;

      summary.push({
        year,
        principalPaid: totalPrincipal,
        interestPaid: totalInterest,
        emiPaid: totalEmi,
        endingBalance,
      });

      yearStartIdx = yearEndIdx;
    }

    return summary;
  }, [result, months]);

  // Download as PDF
  const downloadPDF = useCallback(() => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 15;

    // Header
    doc.setFontSize(18);
    doc.text('EMI Calculator Report', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;

    // Summary Section
    doc.setFontSize(12);
    doc.text('LOAN DETAILS', 15, yPosition);
    yPosition += 7;

    doc.setFontSize(10);
    const summaryData = [
      ['Loan Amount', formatCurrency(principal)],
      ['Annual Interest Rate', `${annualRate.toFixed(1)}% p.a.`],
      ['Loan Tenure', `${Math.floor(months / 12)} years ${months % 12} months`],
    ];

    summaryData.forEach((item) => {
      doc.text(`${item[0]}: `, 15, yPosition);
      doc.text(item[1], 80, yPosition);
      yPosition += 6;
    });

    yPosition += 5;
    doc.setFontSize(12);
    doc.text('CALCULATION RESULTS', 15, yPosition);
    yPosition += 7;

    doc.setFontSize(10);
    const resultData = [
      ['Monthly EMI', formatCurrency(result.emi)],
      ['Total Interest', formatCurrency(result.totalInterest)],
      ['Total Amount Payable', formatCurrency(result.totalAmount)],
    ];

    resultData.forEach((item) => {
      doc.setFont(undefined, 'bold');
      doc.text(`${item[0]}: `, 15, yPosition);
      doc.setFont(undefined, 'normal');
      doc.text(item[1], 80, yPosition);
      yPosition += 6;
    });

    // Check if we need a new page for schedule
    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = 15;
    }

    // Year-wise Schedule
    yPosition += 5;
    doc.setFontSize(12);
    doc.text('YEAR-WISE BREAKDOWN', 15, yPosition);
    yPosition += 7;

    doc.setFontSize(9);
    const yearHeaders = ['Year', 'Principal Paid', 'Interest Paid', 'Total EMI', 'Balance'];
    const yearData = yearWiseSummary.map((row) => [
      `Year ${row.year}`,
      formatCurrency(row.principalPaid),
      formatCurrency(row.interestPaid),
      formatCurrency(row.emiPaid),
      formatCurrency(row.endingBalance),
    ]);

    // Simple table for year-wise data
    yearHeaders.forEach((header, idx) => {
      const xPos = 15 + idx * 38;
      doc.setFont(undefined, 'bold');
      doc.text(header, xPos, yPosition);
    });
    yPosition += 6;

    doc.setFont(undefined, 'normal');
    yearData.forEach((row) => {
      if (yPosition > pageHeight - 15) {
        doc.addPage();
        yPosition = 15;
      }
      row.forEach((cell, idx) => {
        const xPos = 15 + idx * 38;
        doc.text(cell, xPos, yPosition);
      });
      yPosition += 5;
    });

    // Monthly Schedule
    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = 15;
    }

    yPosition += 5;
    doc.setFontSize(12);
    doc.text('MONTH-BY-MONTH SCHEDULE', 15, yPosition);
    yPosition += 7;

    doc.setFontSize(8);
    const monthHeaders = ['Month', 'EMI', 'Principal', 'Interest', 'Balance'];
    monthHeaders.forEach((header, idx) => {
      const xPos = 15 + idx * 36;
      doc.setFont(undefined, 'bold');
      doc.text(header, xPos, yPosition);
    });
    yPosition += 5;

    doc.setFont(undefined, 'normal');
    result.schedule.forEach((row) => {
      if (yPosition > pageHeight - 10) {
        doc.addPage();
        yPosition = 15;
      }
      const monthData = [
        row.month.toString(),
        formatCurrency(row.emi),
        formatCurrency(row.principal),
        formatCurrency(row.interest),
        formatCurrency(row.balance),
      ];
      monthData.forEach((cell, idx) => {
        const xPos = 15 + idx * 36;
        doc.text(cell, xPos, yPosition);
      });
      yPosition += 4;
    });

    doc.save('emi-calculation.pdf');
  }, [principal, annualRate, months, result, yearWiseSummary]);

  // Download as Excel
  const downloadExcel = useCallback(() => {
    const workbook = XLSX.utils.book_new();

    // Summary Sheet
    const summarySheet = [
      ['EMI CALCULATOR REPORT'],
      [],
      ['LOAN DETAILS'],
      ['Loan Amount', principal],
      ['Annual Interest Rate (%)', annualRate],
      ['Loan Tenure (Months)', months],
      ['Loan Tenure (Years)', Math.floor(months / 12) + ' years ' + (months % 12) + ' months'],
      [],
      ['CALCULATION RESULTS'],
      ['Monthly EMI', result.emi],
      ['Total Interest', result.totalInterest],
      ['Total Amount Payable', result.totalAmount],
      ['Principal', result.principal],
    ];

    const summaryWs = XLSX.utils.aoa_to_sheet(summarySheet);
    XLSX.utils.book_append_sheet(workbook, summaryWs, 'Summary');

    // Year-wise Sheet
    const yearwiseData = [
      ['Year', 'Principal Paid', 'Interest Paid', 'Total EMI', 'Balance'],
      ...yearWiseSummary.map((row) => [
        row.year,
        row.principalPaid,
        row.interestPaid,
        row.emiPaid,
        row.endingBalance,
      ]),
    ];

    const yearwiseWs = XLSX.utils.aoa_to_sheet(yearwiseData);
    // Set column widths
    yearwiseWs['!cols'] = [{ wch: 10 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(workbook, yearwiseWs, 'Year-wise');

    // Monthly Schedule Sheet
    const monthlyData = [
      ['Month', 'EMI', 'Principal', 'Interest', 'Balance'],
      ...result.schedule.map((row) => [row.month, row.emi, row.principal, row.interest, row.balance]),
    ];

    const monthlyWs = XLSX.utils.aoa_to_sheet(monthlyData);
    monthlyWs['!cols'] = [{ wch: 10 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }];
    XLSX.utils.book_append_sheet(workbook, monthlyWs, 'Monthly Schedule');

    XLSX.writeFile(workbook, 'emi-calculation.xlsx');
  }, [principal, annualRate, months, result, yearWiseSummary]);

  // Generate share link
  const generateShareLink = useCallback(() => {
    const params = new URLSearchParams({
      principal: principal.toString(),
      rate: annualRate.toString(),
      months: months.toString(),
    });
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    const link = `${baseUrl}${currentPath}?${params.toString()}`;
    setShareLink(link);
    setShowShareModal(true);
  }, [principal, annualRate, months]);

  // Copy to clipboard
  const copyToClipboard = useCallback(() => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareLink);
      alert('Link copied to clipboard!');
    }
  }, [shareLink]);

  return (
    <div className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {toolName && (
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{toolName}</h1>
        )}
        
        {/* Main Calculator Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 mb-8">
          {/* Input Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8">
            {/* Loan Amount */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-3">
                Loan Amount
              </label>
              <div className="relative mb-3">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 font-semibold">₹</span>
                <input
                  type="number"
                  value={principal}
                  onChange={handlePrincipalChange}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-400 text-base md:text-lg"
                  min="100000"
                  step="100000"
                />
              </div>
              <input
                type="range"
                min="100000"
                max="10000000"
                step="100000"
                value={principal}
                onChange={handlePrincipalChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="text-xs text-gray-500 mt-2">
                Range: ₹1L - ₹1Cr
              </div>
            </div>

            {/* Interest Rate */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-3">
                Annual Interest Rate
              </label>
              <div className="relative mb-3">
                <input
                  type="number"
                  value={annualRate}
                  onChange={handleRateChange}
                  step="0.1"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-400 text-base md:text-lg"
                  min="1"
                  max="30"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 font-semibold">%</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="0.1"
                value={annualRate}
                onChange={handleRateChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="text-xs text-gray-500 mt-2">
                Current: {annualRate.toFixed(1)}% p.a.
              </div>
            </div>

            {/* Loan Tenure */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-3">
                Loan Tenure
              </label>
              <div className="relative mb-3">
                <input
                  type="number"
                  value={months}
                  onChange={handleMonthsChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-400 text-base md:text-lg"
                  min="6"
                  step="1"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 font-semibold">months</span>
              </div>
              <input
                type="range"
                min="6"
                max="480"
                step="1"
                value={months}
                onChange={handleMonthsChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="text-xs text-gray-500 mt-2">
                {Math.floor(months / 12)} years {months % 12} months
              </div>
            </div>
          </div>

          {/* Key Results - Highlighted Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-8 bg-gradient-to-b from-blue-50 to-white p-4 md:p-6 rounded-lg border border-blue-100">
            <div className="text-center min-w-0 px-2">
              <p className="text-gray-600 text-xs md:text-sm font-semibold mb-2 md:mb-3">MONTHLY EMI</p>
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-blue-600 break-words leading-tight">
                {formatCurrency(result.emi).split('.')[0]}
              </p>
              <p className="text-xs text-gray-500 mt-1 md:mt-2">per month</p>
            </div>

            <div className="text-center border-l border-r border-gray-300 min-w-0 px-2">
              <p className="text-gray-600 text-xs md:text-sm font-semibold mb-2 md:mb-3">TOTAL INTEREST</p>
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-orange-600 break-words leading-tight">
                {formatCurrency(result.totalInterest).split('.')[0]}
              </p>
              <p className="text-xs text-gray-500 mt-1 md:mt-2">over tenure</p>
            </div>

            <div className="text-center min-w-0 px-2">
              <p className="text-gray-600 text-xs md:text-sm font-semibold mb-2 md:mb-3">TOTAL AMOUNT</p>
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-green-600 break-words leading-tight">
                {formatCurrency(result.totalAmount).split('.')[0]}
              </p>
              <p className="text-xs text-gray-500 mt-1">principal + interest</p>
            </div>
          </div>

          {/* Breakdown Pie Chart Section */}
          <div className="bg-gradient-to-r from-gray-50 to-white p-4 md:p-6 rounded-lg border border-gray-200 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Break-up of Total Payment</h3>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
              {/* Pie Chart Visualization */}
              <div className="relative w-40 h-40 md:w-48 md:h-48">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="45"
                    strokeDasharray={`${(result.principal / result.totalAmount) * 282.6} 282.6`}
                    transform="rotate(-90 50 50)"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="45"
                    strokeDasharray={`${(result.totalInterest / result.totalAmount) * 282.6} 282.6`}
                    strokeDashoffset={-((result.principal / result.totalAmount) * 282.6)}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-center text-xs md:text-sm font-semibold text-gray-700">Loan Amount</span>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-col gap-4 text-center md:text-left">
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <div className="w-4 h-4 bg-blue-500 rounded flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm">
                    <span className="font-semibold">Principal:</span> {formatCurrency(result.principal)} ({((result.principal / result.totalAmount) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <div className="w-4 h-4 bg-orange-500 rounded flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm">
                    <span className="font-semibold">Interest:</span> {formatCurrency(result.totalInterest)} ({((result.totalInterest / result.totalAmount) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Amortization Schedule */}
          <div className="border-t border-gray-200 pt-6">
            <button
              onClick={() => setShowSchedule(!showSchedule)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2 mb-4"
            >
              <span>{showSchedule ? '−' : '+'}</span>
              {showSchedule ? 'Hide' : 'Show'} Payment Schedule
            </button>

            {showSchedule && (
              <div className="space-y-6">
                {/* Year-wise Breakdown */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4 overflow-x-auto">
                  <h4 className="text-xs md:text-sm font-bold text-gray-800 mb-3 md:mb-4 px-2 md:px-0">Year-wise Breakdown</h4>
                  <table className="w-full text-xs md:text-sm">
                    <thead>
                      <tr className="bg-blue-100 border-b-2 border-blue-300">
                        <th className="px-2 md:px-4 py-2 text-left text-gray-700 font-semibold">Year</th>
                        <th className="px-2 md:px-4 py-2 text-right text-gray-700 font-semibold">Principal Paid</th>
                        <th className="px-2 md:px-4 py-2 text-right text-gray-700 font-semibold">Interest Paid</th>
                        <th className="px-2 md:px-4 py-2 text-right text-gray-700 font-semibold">Total EMI</th>
                        <th className="px-2 md:px-4 py-2 text-right text-gray-700 font-semibold">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {yearWiseSummary.map((row, idx) => (
                        <tr key={idx} className="border-b border-blue-100 hover:bg-blue-100">
                          <td className="px-2 md:px-4 py-2 text-gray-700 font-semibold">Year {row.year}</td>
                          <td className="px-2 md:px-4 py-2 text-right text-blue-600 font-semibold text-xs md:text-sm">{formatCurrency(row.principalPaid)}</td>
                          <td className="px-2 md:px-4 py-2 text-right text-orange-600 font-semibold text-xs md:text-sm">{formatCurrency(row.interestPaid)}</td>
                          <td className="px-2 md:px-4 py-2 text-right text-green-600 font-semibold text-xs md:text-sm">{formatCurrency(row.emiPaid)}</td>
                          <td className="px-2 md:px-4 py-2 text-right text-gray-700 font-semibold text-xs md:text-sm">{formatCurrency(row.endingBalance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Monthly Breakdown */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs md:text-sm">
                    <thead>
                      <tr className="bg-gray-100 border-b-2 border-gray-300">
                        <th className="px-2 md:px-4 py-2 text-left text-gray-700 font-semibold">Month</th>
                        <th className="px-2 md:px-4 py-2 text-right text-gray-700 font-semibold">EMI</th>
                        <th className="px-2 md:px-4 py-2 text-right text-gray-700 font-semibold">Principal</th>
                        <th className="px-2 md:px-4 py-2 text-right text-gray-700 font-semibold">Interest</th>
                        <th className="px-2 md:px-4 py-2 text-right text-gray-700 font-semibold">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.schedule.map((row, idx) => (
                        <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-2 md:px-4 py-2 text-gray-700 text-xs md:text-sm">{row.month}</td>
                          <td className="px-2 md:px-4 py-2 text-right text-gray-900 font-medium text-xs md:text-sm">{formatCurrency(row.emi)}</td>
                          <td className="px-2 md:px-4 py-2 text-right text-blue-600 font-semibold text-xs md:text-sm">{formatCurrency(row.principal)}</td>
                          <td className="px-2 md:px-4 py-2 text-right text-orange-600 font-semibold text-xs md:text-sm">{formatCurrency(row.interest)}</td>
                          <td className="px-2 md:px-4 py-2 text-right text-gray-700 font-semibold text-xs md:text-sm">{formatCurrency(row.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Download Section */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Download Your Calculation</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={downloadPDF}
              className="flex-1 bg-white border-2 border-gray-300 hover:border-red-400 hover:bg-red-50 text-gray-700 font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
            >
              📄 Download PDF
            </button>
            <button 
              onClick={downloadExcel}
              className="flex-1 bg-white border-2 border-gray-300 hover:border-green-400 hover:bg-green-50 text-gray-700 font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
            >
              📊 Download Excel
            </button>
            <button 
              onClick={generateShareLink}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
            >
              🔗 Share Link
            </button>
          </div>
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Share Your Calculation</h3>
              <p className="text-sm text-gray-600 mb-4">
                Copy this link to share your calculation with pre-filled values:
              </p>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono text-gray-700"
                />
                <button
                  onClick={copyToClipboard}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition"
                >
                  Copy
                </button>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
        {/* FAQ Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition">
              <summary className="font-bold text-gray-900">What is EMI?</summary>
              <p className="text-gray-700 mt-3 text-sm">
                Equated Monthly Installment (EMI) is the amount you pay monthly to a bank or financial institution to repay your loan. It includes both the principal amount and the interest component. The EMI remains constant throughout the loan tenure, but the proportion of principal and interest changes over time.
              </p>
            </details>

            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition">
              <summary className="font-bold text-gray-900">How is EMI calculated?</summary>
              <p className="text-gray-700 mt-3 text-sm">
                EMI is calculated using the formula: E = P × r × (1 + r)^n / ((1 + r)^n - 1), where P is the principal loan amount, r is the monthly interest rate, and n is the number of months. This ensures equal monthly payments throughout the loan tenure using the reducing balance method.
              </p>
            </details>

            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition">
              <summary className="font-bold text-gray-900">Why does my early EMI have more interest?</summary>
              <p className="text-gray-700 mt-3 text-sm">
                Initially, the outstanding loan balance is highest, so more of your EMI goes toward interest. As you make payments, the principal decreases, and the interest component reduces while the principal component increases. This is called the reducing balance method.
              </p>
            </details>

            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition">
              <summary className="font-bold text-gray-900">Can I use this calculator for any type of loan?</summary>
              <p className="text-gray-700 mt-3 text-sm">
                Yes! This calculator works for any fully amortizing loan including home loans, car loans, personal loans, education loans, and more. Simply enter the loan amount, interest rate, and tenure to calculate your EMI.
              </p>
            </details>

            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition">
              <summary className="font-bold text-gray-900">How can I reduce my total interest payable?</summary>
              <p className="text-gray-700 mt-3 text-sm">
                You can reduce total interest by: 1) Choosing a shorter loan tenure, 2) Making prepayments whenever possible, 3) Negotiating for a lower interest rate, or 4) Using a higher principal payment early in the tenure. Each additional payment reduces the outstanding balance and saves interest on future EMIs.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(EmiCalculatorComponent);
