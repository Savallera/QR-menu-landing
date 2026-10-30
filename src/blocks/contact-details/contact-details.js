document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.contact-details__copy-button').forEach((button) =>
    button.addEventListener('click', async () => {
      const status = button.parentElement.querySelector(
        '.contact-details__copy-status'
      );
      try {
        await navigator.clipboard.writeText(
          'Наименование: Индивидуальный предприниматель Яковлев Семен Игоревич\nИНН: 772405786742\nОГРНИП: 320774600197231\nАдрес регистрации и почтовый адрес: Российская Федерация, 115477, г. Москва, ул. Кантемировская, д. 39, кв. 297\nТелефон: +7 926 414-89-14\nЭлектронная почта для клиентов и обращений по персональным данным: support@showme.menu\nРасчётный счёт: 40802810501500103711\nБанк: ООО «Банк Точка»\nБИК: 044525104\nКорреспондентский счёт: 30101810745374525104'
        );
        status.textContent = 'Реквизиты скопированы';
      } catch {
        status.textContent =
          'Не удалось скопировать. Выделите нужные реквизиты на странице.';
      }
    })
  );
});
