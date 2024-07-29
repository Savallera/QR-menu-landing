document.addEventListener('DOMContentLoaded', () => {
  const monthPayButton = document.getElementById('month_pay_button');
  const yearPayButton = document.getElementById('year_pay_button');

  const monthPayContent = document.getElementById('month_pay_content');
  const yearPayContent = document.getElementById('year_pay_content');

  monthPayButton.addEventListener('click', () => {
    monthPayButton.classList.add('pricing__card-tab_actived');
    yearPayButton.classList.remove('pricing__card-tab_actived');

    monthPayContent.classList.add('pricing__card-price_actived');
    yearPayContent.classList.remove('pricing__card-price_actived');
  });
  yearPayButton.addEventListener('click', () => {
    monthPayButton.classList.remove('pricing__card-tab_actived');
    yearPayButton.classList.add('pricing__card-tab_actived');

    monthPayContent.classList.remove('pricing__card-price_actived');
    yearPayContent.classList.add('pricing__card-price_actived');
  });
});