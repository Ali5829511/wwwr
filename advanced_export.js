        }
    }

    /**
     * تصدير إلى PDF مع صور مصغرة
     */
    async exportToPDF() {
        try {
            // إنشاء نافذة جديدة للطباعة
            const printWindow = window.open('', '_blank');
            
            let html = `
                <!DOCTYPE html>
                <html lang="ar" dir="rtl">
                <head>
                    <meta charset="UTF-8">
                    <title>${this.title}</title>
                    <style>
                        @page {
                            size: A4 landscape;
                            margin: 20mm;
                        }
                        
                        * {
                            margin: 0;
                            padding: 0;
                            box-sizing: border-box;
                        }
                        
                        body {
                            font-family: 'Arial', sans-serif;
                            direction: rtl;
                            padding: 20px;
                            background: white;
                        }
                        
                        .header {
                            text-align: center;
                            margin-bottom: 30px;
                            border-bottom: 3px solid #8B6F47;
                            padding-bottom: 20px;
                        }
                        
                        .header h1 {
                            color: #8B6F47;
                            font-size: 28px;
                            margin-bottom: 10px;
                        }
                        
                        .header p {
                            color: #666;
                            font-size: 14px;
                            margin: 5px 0;
                        }
                        
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-top: 20px;
                        }
                        
                        th, td {
                            border: 1px solid #ddd;
                            padding: 12px;
                            text-align: right;
                            vertical-align: middle;
                        }
                        
                        th {
                            background-color: #8B6F47;
                            color: white;
                            font-weight: bold;
                            font-size: 14px;
                        }
                        
                        tr:nth-child(even) {
                            background-color: #f8f5f0;
                        }
                        
                        .plate-number {
                            font-weight: bold;
                            font-size: 16px;
                            color: #8B6F47;
                        }
                        
                        .thumbnail {
                            width: 80px;
                            height: 60px;
                            object-fit: cover;
                            border-radius: 5px;
                        }
                        
                        .footer {
                            margin-top: 30px;
                            text-align: center;
                            color: #666;
                            font-size: 12px;
                            border-top: 2px solid #ddd;
                            padding-top: 20px;
                        }
                        
                        .summary {
                            display: flex;
                            justify-content: space-around;
                            margin: 20px 0;
                            padding: 15px;
                            background: #f8f5f0;
                            border-radius: 10px;
                        }
                        
                        .summary-item {
                            text-align: center;
                        }
                        
                        .summary-value {
                            font-size: 24px;
                            font-weight: bold;
                            color: #8B6F47;
                        }
                        
                        .summary-label {
                            font-size: 12px;
                            color: #666;
                            margin-top: 5px;
                        }
                        
                        @media print {
                            body {
                                padding: 0;
                            }
                            
                            .no-print {
                                display: none;
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>${this.title}</h1>
                        <p>تاريخ التقرير: ${new Date().toLocaleDateString('ar-SA')} - ${new Date().toLocaleTimeString('ar-SA')}</p>
                        <p>وحدة إسكان هيئة التدريس - جامعة الإمام محمد بن سعود الإسلامية</p>
                    </div>
                    
                    <div class="summary">
                        <div class="summary-item">
                            <div class="summary-value">${this.data.length}</div>
                            <div class="summary-label">إجمالي السيارات</div>
                        </div>
                        <div class="summary-item">