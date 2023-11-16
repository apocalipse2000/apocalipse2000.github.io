<%@ LANGUAGE="VBSCRIPT" %>

<%
linha01 = "--------------Muro das lamentacoes--------------"&chr(13)&chr(13)
linha02 = "Nome          : "		&request("nome")&chr(13)
linha03 = "E-Mail        : "		&request("Email")&chr(13)
linha04 = "Idade      : "		&request("idade")&chr(13)
linha05 = "Tipo de Pedido      : "		&request("pedido")&chr(13)
linha06 = "Pedido : "	&request("mensagem")&chr(13)
linha07 = "-------------------------------------"&chr(13)
%>

<%NmDest  = "APOCALIPSE2000"%>


<%Mensagem  = linha01+linha02+linha03%>
<%Mensagem  = Mensagem + linha04+linha05+linha06+linha07%>
<%Mensagem  = Mensagem + linha07+linha07+linha07+linha07%>
<%Mensagem  = Mensagem + linha07 + linha07 + linha07%>

<%

  If Request.Form("pedido") = "saude" Then
   	Response.Redirect ("http://www.apocalipse2000.com.br/muro_saude.htm")
  Elseif Request.Form("pedido") = "emprego" Then
   	Response.Redirect ("http://www.apocalipse2000.com.br/muro_trabalho.htm")  
  Elseif Request.Form("pedido") = "amor" Then
   	Response.Redirect ("http://www.apocalipse2000.com.br/muro_amor.htm")  
  Elseif Request.Form("pedido") = "vicio" Then
   	Response.Redirect ("http://www.apocalipse2000.com.br/muro_vicio.htm")  
  Elseif Request.Form("pedido") = "financas" Then
   	Response.Redirect ("http://www.apocalipse2000.com.br/muro_financas.htm")  
  'Elseif Request.Form("pedido") = "0" Then
  Else
   	Response.Redirect ("http://www.apocalipse2000.com.br/muro_erro.htm")  
  End if



%>



