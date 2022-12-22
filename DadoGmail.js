function DadoGmail(){
  var gmail = GmailApp.getUserLabelByName("pessoal/despesas");
  var thread = gmail.getThreads()
    
  for (let i=0; i <thread.length; i++) {
    messages = thread[i].getMessages();

    for (var j=0; j<messages.length; j++){
      var email = messages[j];
      var body = email.getPlainBody();
      var sender = email.getFrom();
      var date = email.getDate();

      var addLabel = GmailApp.getUserLabelByName("pessoal/arquivadas"); 
      var tirarlabel = GmailApp.getUserLabelByName("pessoal/despesas");

      thread[i].addLabel(addLabel);
      thread[i].removeLabel(tirarlabel);
         
      var subject;
      switch (email.getSubject()) {
        case "Transferência realizada com sucesso":
          subject = "Transferência Realizada"
          break;
        case "Você recebeu uma transferência!":
          subject = "Transferência Recebida"
          break;
        case "Você recebeu uma transferência pelo Pix!":
          subject = "Transferência Pix"
          break;
        case "Pagamento de fatura realizado com sucesso":
            subject = "Pagamento efetuado"
            break;
        default:
          subject = email.getSubject();
      }
      
      const regex = /R\$ (\d+(?:\.\d{3})?,\d{2})/;
      var amount = regex.exec(body)[1];
      var value = parseFloat(amount.replace(/\./g, '').replace(',', '.'));
      console.log (value);

      }      
        const conteudo = {value, sender, subject, date};
// preciso fazer com que o script adicione uma nova row antes de inserir os dados //
  planilha(conteudo);
    function planilha(conteudo) {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DadoGmail");
      var values = [[conteudo.value, conteudo.sender, conteudo.subject, conteudo.date]];

      if (subject === "Transferência Realizada" || subject === "Pagamento efetuado")  {
        var numRowsInColA = sheet.getRange("A:A").getValues().filter(String).length;
        sheet.getRange(numRowsInColA + 1, 1, 1, 4).setValues(values);
            
      } else if (subject === "Transferência Recebida" || subject === "Transferência Pix") {
        var numRowsInColF = sheet.getRange("F:F").getValues().filter(String).length;
        sheet.getRange(numRowsInColF + 1, 6, 1, 4).setValues(values);
          }
        else {return false}
    }       
  }
}
