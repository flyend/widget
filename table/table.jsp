<%@ page contentType="text/html;charset=utf-8" %>
<%
	request.setCharacterEncoding("utf-8");
	StringBuffer sb = new StringBuffer();
	String[][] arrays = {
		{"1","admin","http://www.baidu.com/","hello"},
		{"2","admin","http://www.baidu.com/","java"},
		{"3","qq","http://www.baidu.com/","c++"},
		{"4","qq","http://www.baidu.com/","太高看自己了吧 日本"},
		{"5","admin","http://www.baidu.com/","德国汽车不比你的更好"},
		{"6","admin","android","kk"},
		{"7","qq","javascript","kk"},
		{"8","admin","实名朋友","你要什么"},
		{"9","qq","如果我","你要什么"},
		{"10","admin","勇气","你要什么"},
		{"11","qq","实名朋友","你要什么"},
		{"12","qq","hello","你要什么"},
		{"13","qq","page","你要什么"},
		{"14","admin","java","你要什么"},
		{"15","qq","unicode","你要什么"},
		{"16","qq","nokia","今天情人节2008演唱会"},
		{"17","qq","utf-8","今天情人节2008演唱会"},
		{"18","admin","点击星星","今天情人节2008演唱会"},
		{"19","tt","c++","梁静茹"},
		{"20","qq","chrome","今天情人节2008演唱会"},
		{"21","admin","count","梁静茹"},
		{"22","qq","google","今天情人节2008演唱会"},
		{"23","qq","data","梁静茹"},
		{"24","qq","moto","今天情人节2008演唱会"},
		{"25","admin","parseInt","梁静茹"},
		{"26","qq","print","今天情人节2008演唱会"},
		{"27","qq","append","梁静茹"},
		{"28","qq",">>","今天情人节2008演唱会"},
		{"29","dd","length","梁静茹"},
		{"30","qq","js","今天情人节2008演唱会"},
		{"31","dd","item","梁静茹"},
		{"32","qq","如果我","今天情人节2008演唱会"},
		{"33","qq","firebug","今天情人节2008演唱会"},
		{"34","qq","firebug","今天情人节2008演唱会"},
		{"35","qq","firebug","今天情人节2008演唱会"},
		{"36","qq","firebug","今天情人节2008演唱会"},
		{"37","qq","firebug","今天情人节2008演唱会"},
		{"38","qq","firebug","今天情人节2008演唱会"},
		{"39","qq","firebug","今天情人节2008演唱会"},
		{"40","qq","firebug","今天情人节2008演唱会"},
		{"41","qq","firebug","今天情人节2008演唱会"},
		{"42","qq","firebug","今天情人节2008演唱会"},
		{"43","qq","firebug","今天情人节2008演唱会"}
	};
	String del = request.getParameter("del");
	//String name = request.getParameterNames();
	//java.util.ArrayList<String> list = new java.util.ArrayList<String>();
	String[][] newArray = null;
	if(del != null){
		String[] ids = del.split(",");
		int length = arrays.length;
		int len = length - ids.length;
		int fieldLength = arrays[0].length;
		newArray = new String[len][fieldLength];
		while(length-- > 0){
			if(!arrays[length][0].equals(ids[0])){
				--len;
				for(int j = 0; j < fieldLength; j++){
					newArray[len][j] = arrays[length][j];
				}
			}
		}
	}
	String[] keys = {"id","name","url","author"};//四列
	String	pages = request.getParameter("page");
	String column = request.getParameter("column");
	String[][] datas = newArray != null ? newArray : arrays;
	if(column == null){
		column = "10";	
	}
	int count = Integer.parseInt(column),
		pageCount = arrays.length / count;
	sb.append("{\"length\":").append(String.valueOf(datas.length)).append(",");
	sb.append("\"data\":").append("[");
	int col = Integer.parseInt(column);
	int start = (Integer.parseInt(pages) - 1) * col;
	int end = start + col;
	if(end > datas.length)
		end = datas.length;
	for(int i = start; i < end; i++){
		String[] fields = datas[i];
		sb.append("{");
		for(int j = 0, len = fields.length; j < len; j++){
			sb.append("\"").append(keys[j]).append("\":");
			sb.append("\"").append(fields[j]).append("\"");
			if((j ^ (len - 1)) > 0)
				sb.append(",");
		}
		sb.append("}");
		if((i ^ end - 1) > 0)
			sb.append(",");
	}
	out.println(sb.append("]").append("}").toString());
%>