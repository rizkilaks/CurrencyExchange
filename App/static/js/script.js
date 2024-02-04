const [primaryCurrency, primaryAmount, secondaryCurrency, swap, exchangeRate, baseRate, rateNotes] = [
  "primary-currency",
  "primary-amount",
  "secondary-currency",
  "swap",
  "rate",
  "base-rate",
  "rate-notes",
].map((id) => document.getElementById(id));

function getSelectedOptionData(selectElement) {
  const selectedOption = selectElement.options[selectElement.selectedIndex];
  return JSON.parse(selectedOption.value);
}

function calculate() {
  const { code: primaryCode, name: primaryName } = getSelectedOptionData(primaryCurrency);
  const { code: secondaryCode, name: secondaryName } = getSelectedOptionData(secondaryCurrency);
  const amount = primaryAmount.value;

  fetch(`https://v6.exchangerate-api.com/v6/01f39b3df4bb48814d7074a7/latest/${primaryCode}`)
    .then((res) => res.json())
    .then((data) => {
      const rate = data.conversion_rates[secondaryCode];
      const conversion = amount * rate;
      exchangeRate.innerText = `${formatAmount(amount)} ${primaryName} =`;
      exchangeRate.innerText += `\n ${formatRate(conversion)} ${secondaryName}`;
      rateNotes.innerText = "exchange rate is updated daily";
      baseRate.innerText = `\n1 ${primaryCode} = ${formatRate(rate)} ${secondaryCode}`;
      baseRate.innerText += `\n1 ${secondaryCode} = ${formatRate(1 / rate)} ${primaryCode}`;
    });
}

function formatRate(value) {
  const absValue = Math.abs(value);
  let formattedValue;

  if (absValue < 1) {
    formattedValue = value.toFixed(10).replace(/\.?0+$/, "");
  } else if (value >= 0) {
    formattedValue = value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return formattedValue;
}

function formatAmount(value) {
  if (value < 1) {
    return parseFloat(value)
      .toFixed(10)
      .replace(/\.?0+$/, "");
  } else {
    return parseFloat(value)
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}

function swapCurrencies() {
  const primaryValue = primaryCurrency.value;
  primaryCurrency.value = secondaryCurrency.value;
  secondaryCurrency.value = primaryValue;
  calculate();
}

primaryCurrency.addEventListener("change", calculate);
primaryAmount.addEventListener("input", calculate);
secondaryCurrency.addEventListener("change", calculate);
swap.addEventListener("click", swapCurrencies);
