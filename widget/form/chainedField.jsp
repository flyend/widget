<%@ page contentType="text/html;charset=utf-8" %>
<%
	request.setCharacterEncoding("utf-8");
	//response.setContentType("text/plan; charset=UTF-8");
	response.setHeader("Expires", "0");   
	response.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");   
	response.addHeader("Cache-Control", "post-check=0, pre-check=0");   
	response.setHeader("Pragma", "no-cache");
	StringBuffer output = new StringBuffer();
	if(request.getParameter("id").equals("-1")){
		output.append("[");
		output.append("{\"id\": 1, \"value\": \"北京\"},");
		output.append("{\"id\": 21, \"value\": \"天津\"},");
		output.append("{\"id\": 40, \"value\": \"上海\"},");
		output.append("{\"id\": 61, \"value\": \"重庆\"},");
		output.append("{\"id\": 102, \"value\": \"河北省\"},");
		output.append("{\"id\": 297, \"value\": \"山西省\"},");
		output.append("{\"id\": 439, \"value\": \"内蒙古区\"},");
		output.append("{\"id\": 561, \"value\": \"辽宁省\"},");
		output.append("{\"id\": 690, \"value\": \"吉林省\"},");
		output.append("{\"id\": 768, \"value\": \"黑龙江省\"},");
		output.append("{\"id\": 924, \"value\": \"江苏省\"},");
		output.append("{\"id\": 1057, \"value\": \"浙江省\"},");
		output.append("{\"id\": 1170, \"value\": \"安徽省\"},");
		output.append("{\"id\": 1310, \"value\": \"福建省\"},");
		output.append("{\"id\": 1414, \"value\": \"江西省\"},");
		output.append("{\"id\": 1536, \"value\": \"山东省\"},");
		output.append("{\"id\": 1711, \"value\": \"河南省\"}");
		output.append("]");
	}
	else if(request.getParameter("id").equals("102")){
		output.append("[{\"id\": 103, \"value\": \"石家庄\"},");
		output.append("{\"id\": 128, \"value\": \"唐山\"},");
		output.append("{\"id\": 144, \"value\": \"河北省\"},");
		output.append("{\"id\": 153, \"value\": \"秦皇岛\"},");
		output.append("{\"id\": 174, \"value\": \"邢台\"},");
		output.append("{\"id\": 195, \"value\": \"廊坊\"}]");
	}
	else if(request.getParameter("id").equals("103")){
		output.append("[{\"id\": 129, \"value\": \"市辖区\"},");
		output.append("{\"id\": 130, \"value\": \"路南区\"},");
		output.append("{\"id\": 131, \"value\": \"路北区\"},");
		output.append("{\"id\": 132, \"value\": \"古冶区\"},");
		output.append("{\"id\": 133, \"value\": \"开平区\"},");
		output.append("{\"id\": 134, \"value\": \"丰南区\"}]");
	}
	else{
		output.append("[]");
	}
	out.println(output);
%>