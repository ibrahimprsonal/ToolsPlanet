// State
let exchangeRates = {};
let availableCurrencies = [];
let fromCurrency = 'USD';
let toCurrency = 'BDT';

// DOM Elements
const amountInput = document.getElementById('amount');
const fromSelected = document.getElementById('from-selected');
const toSelected = document.getElementById('to-selected');
const fromOptionsList = document.getElementById('from-options-list');
const toOptionsList = document.getElementById('to-options-list');
const fromSearch = document.getElementById('from-search');
const toSearch = document.getElementById('to-search');
const swapBtn = document.getElementById('swap-btn');

// Result Elements
const baseAmountText = document.getElementById('base-amount-text');
const convertedAmountText = document.getElementById('converted-amount');
const targetSymbolText = document.getElementById('target-symbol');
const targetCodeText = document.getElementById('target-code');
const rateInfoText = document.getElementById('rate-info');
const lastUpdatedText = document.getElementById('last-updated');
const fromSymbolElement = document.getElementById('from-symbol');

// Utility Functions
function getFlagEmoji(currencyCode) {
    // Some exceptions and regionals
    const exceptions = {
        'EUR': '🇪🇺',
        'XAF': '🌍', 'XOF': '🌍', 'XCD': '🌍', 'XPF': '🌍'
    };
    if (exceptions[currencyCode]) return exceptions[currencyCode];
    
    // Default: Convert first two letters of currency code to regional indicator emojis
    const countryCode = currencyCode.substring(0, 2).toUpperCase();
    return countryCode.replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397));
}

function getCurrencyName(currencyCode) {
    try {
        return new Intl.DisplayNames(['en'], { type: 'currency' }).of(currencyCode) || currencyCode;
    } catch (e) {
        return currencyCode;
    }
}

function getCurrencySymbol(currencyCode) {
    try {
        const parts = new Intl.NumberFormat('en', { style: 'currency', currency: currencyCode }).formatToParts(0);
        const symbolPart = parts.find(part => part.type === 'currency');
        return symbolPart ? symbolPart.value : currencyCode;
    } catch (e) {
        return currencyCode;
    }
}

async function fetchRates() {
    try {
        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await response.json();
        
        if (data.result === 'success') {
            exchangeRates = data.rates;
            availableCurrencies = Object.keys(exchangeRates).sort();
            
            const date = new Date(data.time_last_update_utc);
            lastUpdatedText.innerText = `Last updated: ${date.toLocaleString()}`;
            
            populateDropdowns();
            updateUI();
            calculateConversion();
        } else {
            throw new Error('API Error');
        }
    } catch (error) {
        lastUpdatedText.innerText = 'Error fetching rates. Please check your connection.';
        console.error('Failed to fetch rates:', error);
    }
}

function createOptionHTML(currency) {
    const flag = getFlagEmoji(currency);
    const name = getCurrencyName(currency);
    return `
        <div class="option-item" data-currency="${currency}">
            <span class="flag-icon">${flag}</span>
            <span class="currency-code">${currency}</span>
            <span class="currency-name">${name}</span>
        </div>
    `;
}

function populateDropdowns() {
    const optionsHTML = availableCurrencies.map(createOptionHTML).join('');
    fromOptionsList.innerHTML = optionsHTML;
    toOptionsList.innerHTML = optionsHTML;
    
    // Add Event Listeners to new options
    document.querySelectorAll('#from-options-list .option-item').forEach(item => {
        item.addEventListener('click', () => {
            fromCurrency = item.dataset.currency;
            updateUI();
            calculateConversion();
            closeAllSelects();
        });
    });
    
    document.querySelectorAll('#to-options-list .option-item').forEach(item => {
        item.addEventListener('click', () => {
            toCurrency = item.dataset.currency;
            updateUI();
            calculateConversion();
            closeAllSelects();
        });
    });
}

function updateUI() {
    // Update From Selected
    document.getElementById('from-flag').innerText = getFlagEmoji(fromCurrency);
    document.getElementById('from-code-display').innerText = fromCurrency;
    fromSymbolElement.innerText = getCurrencySymbol(fromCurrency);
    
    // Update To Selected
    document.getElementById('to-flag').innerText = getFlagEmoji(toCurrency);
    document.getElementById('to-code-display').innerText = toCurrency;
    targetSymbolText.innerText = getCurrencySymbol(toCurrency);
    targetCodeText.innerText = toCurrency;
}

function calculateConversion() {
    if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) return;
    
    let amount = parseFloat(amountInput.value);
    if (isNaN(amount) || amount < 0) {
        amount = 0;
    }
    
    // Convert logic: (Amount / FromRate) * ToRate
    const rate = exchangeRates[toCurrency] / exchangeRates[fromCurrency];
    const convertedAmount = amount * rate;
    
    // Update DOM
    baseAmountText.innerText = `${amount.toLocaleString('en-US', {maximumFractionDigits: 2})} ${fromCurrency} =`;
    
    // Format final amount dynamically based on size
    let formattedConvertedAmount;
    if (convertedAmount < 0.01 && convertedAmount > 0) {
        formattedConvertedAmount = convertedAmount.toFixed(6); // Show more decimals for tiny values like Crypto
    } else {
        formattedConvertedAmount = convertedAmount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
    
    convertedAmountText.innerText = formattedConvertedAmount;
    
    // Update rate info
    let displayRate = rate;
    if (displayRate < 0.01) {
        displayRate = rate.toFixed(6);
    } else {
        displayRate = rate.toFixed(4);
    }
    rateInfoText.innerText = `1 ${fromCurrency} = ${displayRate} ${toCurrency}`;
}

// Event Listeners
amountInput.addEventListener('input', calculateConversion);

swapBtn.addEventListener('click', () => {
    // Add rotation animation to the button icon
    const icon = swapBtn.querySelector('i');
    icon.style.transform = `rotate(${swapBtn.dataset.rotation || 180}deg)`;
    swapBtn.dataset.rotation = parseInt(swapBtn.dataset.rotation || 180) + 180;

    const temp = fromCurrency;
    fromCurrency = toCurrency;
    toCurrency = temp;
    updateUI();
    calculateConversion();
});

// Dropdown Logic
function closeAllSelects() {
    document.getElementById('from-dropdown').classList.add('hide');
    document.getElementById('to-dropdown').classList.add('hide');
    document.getElementById('from-selected').classList.remove('active');
    document.getElementById('to-selected').classList.remove('active');
}

document.getElementById('from-selected').addEventListener('click', (e) => {
    e.stopPropagation();
    const dropdown = document.getElementById('from-dropdown');
    const isHidden = dropdown.classList.contains('hide');
    closeAllSelects(); // Close others
    if (isHidden) {
        dropdown.classList.remove('hide');
        document.getElementById('from-selected').classList.add('active');
        fromSearch.value = ''; // Reset search
        fromSearch.dispatchEvent(new Event('input')); // Trigger reset filter
        fromSearch.focus();
    }
});

document.getElementById('to-selected').addEventListener('click', (e) => {
    e.stopPropagation();
    const dropdown = document.getElementById('to-dropdown');
    const isHidden = dropdown.classList.contains('hide');
    closeAllSelects(); // Close others
    if (isHidden) {
        dropdown.classList.remove('hide');
        document.getElementById('to-selected').classList.add('active');
        toSearch.value = ''; // Reset search
        toSearch.dispatchEvent(new Event('input')); // Trigger reset filter
        toSearch.focus();
    }
});

// Stop propagation from search box to avoid closing dropdown
document.querySelectorAll('.search-box').forEach(box => {
    box.addEventListener('click', (e) => e.stopPropagation());
});

document.addEventListener('click', closeAllSelects);

// Search filtering
function handleSearch(searchInput, optionsListId) {
    searchInput.addEventListener('input', (e) => {
        const filter = e.target.value.toLowerCase();
        const options = document.querySelectorAll(`#${optionsListId} .option-item`);
        
        options.forEach(option => {
            const code = option.querySelector('.currency-code').innerText.toLowerCase();
            const name = option.querySelector('.currency-name').innerText.toLowerCase();
            if (code.includes(filter) || name.includes(filter)) {
                option.style.display = 'flex';
            } else {
                option.style.display = 'none';
            }
        });
    });
}

handleSearch(fromSearch, 'from-options-list');
handleSearch(toSearch, 'to-options-list');

// Init
fetchRates();
