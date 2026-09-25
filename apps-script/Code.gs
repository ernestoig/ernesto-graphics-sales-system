/**
 * ERNESTO GRAPHICS - Invoice Email Automation
 * Deploy as a Web App: Execute as Me; Who has access: Anyone.
 */
function doGet() {
  return ContentService.createTextOutput(JSON.stringify({ok:true,service:"ERNESTO GRAPHICS Invoice Notifications"}))
    .setMimeType(ContentService.MimeType.JSON);
}
function doPost(e) {
  try {
    var p=(e&&e.parameter)?e.parameter:{};
    var ownerEmail=Session.getEffectiveUser().getEmail();
    if(!ownerEmail) throw new Error("Could not determine the notification Gmail address.");
    var invoiceNo=p.invoiceNo||"N/A", customer=p.customer||"N/A", customerEmail=(p.customerEmail||"").trim();
    var phone=p.phone||"", date=p.date||"", item=p.item||"", qty=p.qty||"0", price=p.price||"0.00";
    var subtotal=p.subtotal||"0.00", taxRate=p.taxRate||"0", tax=p.tax||"0.00", amount=p.amount||"0.00";
    var amountPaid=p.amountPaid||"0.00", balance=p.balance||"0.00", payment=p.payment||"Unpaid", notes=p.notes||"";
    var subject="New ERNESTO GRAPHICS Invoice - "+invoiceNo;
    var text=[
      "ERNESTO GRAPHICS - New Invoice Received","Invoice: "+invoiceNo,"Date: "+date,
      "Customer: "+customer,phone?"Phone: "+phone:"","Item / Service: "+item,"Quantity: "+qty,
      "Unit Price: GH₵"+price,"Subtotal: GH₵"+subtotal,"Tax ("+taxRate+"%): GH₵"+tax,
      "Amount: GH₵"+amount,"Amount Paid: GH₵"+amountPaid,"Balance Due: GH₵"+balance,
      "Payment Status: "+payment,notes?"Notes: "+notes:""
    ].filter(Boolean).join("\n");
    var html="<div style='font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#222'>"+
      "<div style='background:#121212;color:#fff;padding:20px;border-radius:12px 12px 0 0'><b style='color:#fca311'>ERNESTO GRAPHICS</b><h2>New Invoice Received</h2></div>"+
      "<div style='border:1px solid #ddd;border-top:0;padding:20px'><p><b>Invoice:</b> "+esc_(invoiceNo)+"<br><b>Date:</b> "+esc_(date)+"<br><b>Customer:</b> "+esc_(customer)+(phone?"<br><b>Phone:</b> "+esc_(phone):"")+"</p>"+
      "<table style='width:100%;border-collapse:collapse'>"+
      row_("Item / Service",item)+row_("Quantity",qty)+row_("Unit Price","GH₵"+price)+row_("Subtotal","GH₵"+subtotal)+row_("Tax ("+taxRate+"%)","GH₵"+tax)+
      row_("Amount","GH₵"+amount,true)+row_("Amount Paid","GH₵"+amountPaid)+row_("Balance Due","GH₵"+balance,true)+row_("Payment Status",payment)+
      "</table>"+(notes?"<p><b>Notes:</b><br>"+esc_(notes)+"</p>":"")+"</div></div>";
    MailApp.sendEmail({to:ownerEmail,subject:subject,body:text,htmlBody:html,name:"ERNESTO GRAPHICS"});
    if(customerEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail))
      MailApp.sendEmail({to:customerEmail,subject:"ERNESTO GRAPHICS Invoice - "+invoiceNo,body:text+"\n\nThank you for your business.",htmlBody:html+"<p>Thank you for your business.</p>",name:"ERNESTO GRAPHICS"});
    return json_({ok:true,invoiceNo:invoiceNo});
  } catch(err) { return json_({ok:false,error:String(err&&err.message?err.message:err)}); }
}
function esc_(v){return String(v==null?"":v).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function row_(label,value,strong){return "<tr><td style='padding:8px;border-bottom:1px solid #eee'>"+label+"</td><td style='padding:8px;border-bottom:1px solid #eee;text-align:right;"+(strong?"font-weight:700;":"")+"'>"+esc_(value)+"</td></tr>";}
function json_(obj){return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);}
