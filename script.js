let investments = [];

        // Set today's date as default
        document.getElementById('purchaseDate').value = new Date().toISOString().split('T')[0];

        function addInvestment() {
            const name = document.getElementById('investmentName').value.trim();
            const type = document.getElementById('investmentType').value;
            const amount = parseFloat(document.getElementById('investmentAmount').value);
            const currentValue = parseFloat(document.getElementById('currentValue').value);
            const purchaseDate = document.getElementById('purchaseDate').value;

            if (!name || !type || !amount || !currentValue || !purchaseDate) {
                alert('Please fill in all fields!');
                return;
            }

            if (amount <= 0 || currentValue <= 0) {
                alert('Amounts must be greater than zero!');
                return;
            }

            const investment = {
                id: Date.now(),
                name,
                type,
                amount,
                currentValue,
                purchaseDate,
                gainLoss: currentValue - amount,
                gainLossPercent: ((currentValue - amount) / amount * 100).toFixed(2),
                addedDate: new Date().toLocaleDateString()
            };

            investments.push(investment);
            
            // Clear form
            document.getElementById('investmentName').value = '';
            document.getElementById('investmentType').value = '';
            document.getElementById('investmentAmount').value = '';
            document.getElementById('currentValue').value = '';
            document.getElementById('purchaseDate').value = new Date().toISOString().split('T')[0];

            updateDisplay();
        }

        function deleteInvestment(id) {
            investments = investments.filter(inv => inv.id !== id);
            updateDisplay();
        }

        function updateDisplay() {
            updateStats();
            displayInvestments();
            updateAllocation();
        }

        function updateStats() {
            const totalValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
            const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
            const totalGains = totalValue - totalInvested;
            const monthlyReturn = totalInvested > 0 ? (totalGains / totalInvested * 100).toFixed(1) : 0;

            document.getElementById('totalValue').textContent = `$${totalValue.toLocaleString()}`;
            document.getElementById('totalGains').textContent = `$${totalGains.toLocaleString()}`;
            document.getElementById('monthlyReturn').textContent = `${monthlyReturn}%`;
            document.getElementById('totalInvestments').textContent = investments.length;
        }

        function displayInvestments() {
            const container = document.getElementById('investmentsList');
            
            if (investments.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">💼</div>
                        <p>No investments yet. Add your first investment above!</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = investments.map(inv => `
                <div class="investment-item fade-in">
                    <button class="delete-btn" onclick="deleteInvestment(${inv.id})">×</button>
                    <div class="investment-header">
                        <div class="investment-name">
                            ${getTypeIcon(inv.type)}
                            ${inv.name}
                        </div>
                        <div class="investment-type">${inv.type}</div>
                    </div>
                    <div class="investment-details">
                        <div class="detail-item">
                            <div class="detail-value">$${inv.amount.toLocaleString()}</div>
                            <div class="detail-label">Invested</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-value">$${inv.currentValue.toLocaleString()}</div>
                            <div class="detail-label">Current Value</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-value ${inv.gainLoss >= 0 ? 'profit' : 'loss'}">
                                $${Math.abs(inv.gainLoss).toLocaleString()}
                            </div>
                            <div class="detail-label">${inv.gainLoss >= 0 ? 'Profit' : 'Loss'}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-value ${inv.gainLoss >= 0 ? 'profit' : 'loss'}">
                                ${inv.gainLoss >= 0 ? '+' : ''}${inv.gainLossPercent}%
                            </div>
                            <div class="detail-label">Return</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-value">${inv.purchaseDate}</div>
                            <div class="detail-label">Purchase Date</div>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        function updateAllocation() {
            const container = document.getElementById('allocationChart');
            
            if (investments.length === 0) {
                container.innerHTML = `
                    <div style="text-align: center; color: rgba(255,255,255,0.6); padding: 20px;">
                        Add investments to see allocation breakdown
                    </div>
                `;
                return;
            }

            const typeAllocation = {};
            const totalValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);

            investments.forEach(inv => {
                typeAllocation[inv.type] = (typeAllocation[inv.type] || 0) + inv.currentValue;
            });

            container.innerHTML = Object.entries(typeAllocation)
                .sort(([,a], [,b]) => b - a)
                .map(([type, value]) => {
                    const percentage = ((value / totalValue) * 100).toFixed(1);
                    return `
                        <div class="allocation-item">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                ${getTypeIcon(type)}
                                <span>${type.charAt(0).toUpperCase() + type.slice(1)}</span>
                            </div>
                            <div class="allocation-bar">
                                <div class="allocation-fill" style="width: ${percentage}%"></div>
                            </div>
                            <div style="font-weight: 600;">${percentage}%</div>
                        </div>
                    `;
                }).join('');
        }

        function getTypeIcon(type) {
            const icons = {
                'stocks': '📈',
                'crypto': '₿',
                'bonds': '📜',
                'etf': '🎯',
                'real-estate': '🏠',
                'commodities': '🥇'
            };
            return icons[type] || '💼';
        }

        // Add sample data for demo
        function addSampleData() {
            const sampleInvestments = [
                {
                    name: "Apple Inc. (AAPL)",
                    type: "stocks",
                    amount: 5000,
                    currentValue: 5750,
                    purchaseDate: "2025-07-15"
                },
                {
                    name: "Bitcoin",
                    type: "crypto", 
                    amount: 3000,
                    currentValue: 3450,
                    purchaseDate: "2025-08-01"
                },
                {
                    name: "Vanguard S&P 500 ETF",
                    type: "etf",
                    amount: 2000,
                    currentValue: 2180,
                    purchaseDate: "2025-07-20"
                },
                {
                    name: "US Treasury Bonds",
                    type: "bonds",
                    amount: 1500,
                    currentValue: 1520,
                    purchaseDate: "2025-06-10"
                }
            ];

            sampleInvestments.forEach((inv, index) => {
                const investment = {
                    ...inv,
                    id: Date.now() + index,
                    gainLoss: inv.currentValue - inv.amount,
                    gainLossPercent: ((inv.currentValue - inv.amount) / inv.amount * 100).toFixed(2),
                    addedDate: new Date().toLocaleDateString()
                };
                investments.push(investment);
            });

            updateDisplay();
        }

        // Initialize with sample data
        window.addEventListener('load', () => {
            setTimeout(addSampleData, 1000);
        });

        // Add some interactive effects
        document.addEventListener('DOMContentLoaded', function() {
            // Animate stats on load
            setTimeout(() => {
                const statValues = document.querySelectorAll('.stat-value');
                statValues.forEach(stat => {
                    stat.style.transform = 'scale(1.05)';
                    setTimeout(() => {
                        stat.style.transform = 'scale(1)';
                    }, 200);
                });
            }, 500);

            // Add floating animation to header icon
            const header = document.querySelector('.header');
            setInterval(() => {
                header.style.transform = 'translateY(-2px)';
                setTimeout(() => {
                    header.style.transform = 'translateY(0)';
                }, 1000);
            }, 3000);
        });