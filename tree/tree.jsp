<%@ page contentType="text/html;charset=utf-8" %>
<%
	StringBuffer output=new StringBuffer();
	int len=100;
	output.append("[");
	switch(Integer.parseInt(request.getParameter("id"))){
		case -1:
			String s="";
			for(int i=1; i<=len; i++){
				if(0 != (i ^ --len))
					s += "{\"text\": \"二级\", \"value\": " + i + ", \"children\": 1, \"status\": \"" + ((i & 1) == 0 ? "all" : "on") + "\"}" + ",";
				else{
					s += "{\"text\": \"二级\", \"value\": " + i + ", \"children\": 0, \"status\": \"all\"}";
				}
				//len--;
			}
			output.append(s);
		break;
		case 1:
			s="";
			while(len>1){
				len >>= 1;
				if((len | 1) == 1)
					s += "{\"text\": \"二级\", \"value\": " + len + ", \"status\": \"all\"}";
				else
					s += "{\"text\": \"二级\", \"value\": " + len + ", \"children\": true, \"status\": \"" + ((len & 1) == 0 ? "all" : "on") + "\"}" + ",";
				
			}
			output.append(s);
		break;
		case 3:
			s="";
			while(len-->0){
				if((len ^ 1) != 1){
					s += "\"中文"+len+"\",";
				}
				else
					s += "\"java"+len+"\"";
			}
			output.append(s);
		break;
		case 4:
			s="";
			for(int i=1; i<=len; i++){
				if(0 != (i ^ --len))
					s += "{\"text\": \"一级\", \"value\": " + i + ", \"children\": [{\"text\": \"二级\"}]}" + ",";
				else{
					s += "{\"text\": \"一级\", \"value\": " + i + "}";
				}
			}
			output.append(s);
		break;
		case 100:
			s="";
			s += "根,-1,1,on";
			output.append(s);
		break;
	}
	output.append("]");
	out.println(output.toString());
%>