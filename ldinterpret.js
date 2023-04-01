class BinOp{
    op;
    name1;
    name2;
    name3;
    literal;
	constructor(op,n1,n2,n3,l){this.op=op;this.name1=n1;this.name2=n2;this.name3=n3;this.literal=l;}
};

class ldinterpret{
	#INT_IF_GROUP=function(x){return(((x) >= 50) && ((x) < 60));}
	#MAX_INT_OPS=(1024*16);
	#MAX_OPS=1024;
	#MAX_VARIABLES=128;
	#MAX_INTERNAL_RELAYS=128;

	Program=[this.#MAX_OPS];
	Integers=[this.#MAX_VARIABLES];
	Bits=[this.#MAX_INTERNAL_RELAYS];
	
	
	
	AddrX=[8];
	AddrY=[8];
	AddrA=[8];
	AddrP=[8];
	
	#intcode={                     
		INT_SET_BIT                           :   1,
		INT_CLEAR_BIT                         :   2,
		INT_COPY_BIT_TO_BIT                   :   3,
		INT_SET_VARIABLE_TO_LITERAL           :   4,
		INT_SET_VARIABLE_TO_VARIABLE          :   5,   
		INT_INCREMENT_VARIABLE                :   6,
		INT_SET_VARIABLE_ADD                  :   7,
		INT_SET_VARIABLE_SUBTRACT             :   8,
		INT_SET_VARIABLE_MULTIPLY             :   9,
		INT_SET_VARIABLE_DIVIDE               :  10,
		INT_READ_ADC                          :  11,
		INT_SET_PWM                           :  12,
		INT_UART_SEND                         :  13,
		INT_UART_RECV                         :  14,
		INT_EEPROM_BUSY_CHECK                 :  15,
		INT_EEPROM_READ                       :  16,
		INT_EEPROM_WRITE                      :  17,
		INT_IF_BIT_SET                        :  50,
		INT_IF_BIT_CLEAR                      :  51,
		INT_IF_VARIABLE_LES_LITERAL           :  52,
		INT_IF_VARIABLE_EQUALS_VARIABLE       :  53,
		INT_IF_VARIABLE_GRT_VARIABLE          :  54,
		INT_ELSE                              :  60,
		INT_END_IF                            :  61,
		INT_SIMULATE_NODE_STATE               :  80,
		INT_COMMENT                           : 100,
		INT_END_OF_PROGRAM                    : 255};
	
	
	
	InterpretOneCycle=function(){}

	
	#HexConv={'a':10,'b':11,'c':12,'d':13,'e':14,'f':15};
	
	#HexDigit=function(c)
	{
	c = c.toLowerCase();
	if(c >= '0' && c <= '9') {
		return c - '0';
	} else if(c >= 'a' && c <= 'f') {
		return this.#HexConv[c];
	} else {
	}
	return 0;
	}
	
	InitEmptyProgram=function()
	{
	for(let i=0;i<8;i++){
		this.AddrX[i]=-1;
		this.AddrY[i]=-1;
		this.AddrA[i]=-1;
		this.AddrP[i]=-1;
	}
	this.Program[0]=new BinOp(0xff,0,0,0,0);
	}

	Disassemble=function()
	{
	for(let pc = 0; ; pc++) {
		let p = this.Program[pc];
		console.log("PC:", pc);
		let c;
		switch(p.op) {
		case this.#intcode.INT_SET_BIT:
			console.log("bits", p.name1,":=1");
			break;

		case this.#intcode.INT_CLEAR_BIT:
			console.log("bits", p.name1,":=0");
			break;

		case this.#intcode.INT_COPY_BIT_TO_BIT:
			console.log("bits", p.name1,":= bits",p.name2);
			break;

		case this.#intcode.INT_SET_VARIABLE_TO_LITERAL:
			console.log("int16s",p.name1,":=",p.literal);
			break;

		case this.#intcode.INT_SET_VARIABLE_TO_VARIABLE:
		console.log("int16s",p.name1,";= int16s", p.name2);
			break;

		case this.#intcode.INT_INCREMENT_VARIABLE:
		console.log("(int16s[",p.name1,"])++");
			break;

			
			
			case this.#intcode.INT_SET_VARIABLE_ADD: c = '+'; arith();break;
			case this.#intcode.INT_SET_VARIABLE_SUBTRACT: c = '-';arith();break;
			case this.#intcode.INT_SET_VARIABLE_MULTIPLY: c = '*'; arith();break;
			case this.#intcode.INT_SET_VARIABLE_DIVIDE: c = '/'; arith();break;
		function arith()
		{
			console.log("int16s[",p.name1,"] := int16s[",p.name2,"] ",c," int16s[",p.name3,"]");
				
		}

		case this.#intcode.INT_IF_BIT_SET:
		console.log("unless (bits[",p.name1,"] set)");
			cond();break;
		case this.#intcode.INT_IF_BIT_CLEAR:
		console.log("unless (bits[",p.name1,"] clear)");
			cond();break;
		case this.#intcode.INT_IF_VARIABLE_LES_LITERAL:
		console.log("unless (int16s[",p.name1,"] <", p.literal);
			cond();break;
		case this.#intcode.INT_IF_VARIABLE_EQUALS_VARIABLE:
		console.log("unless (int16s[",p.name1,"] == int16s[",p.name2,"])");
			cond();break;
		case this.#intcode.INT_IF_VARIABLE_GRT_VARIABLE:
		console.log("unless (int16s[",p.name1,"] > int16s[",p.name2,"])");
			cond();break;
		function cond(){
			console.log(" jump", p.name3);
		}

		case this.#intcode.INT_ELSE:
			console.log("jump", p.name3);
			break;

		case this.#intcode.INT_END_OF_PROGRAM:
			console.log("<end of program>\n");
			return;

		default:
			break;
		}
		console.log("\n");
	}
}


InterpretOneCycle=function()
{
	for(let pc = 0; ; pc++) {
		let p = this.Program[pc];

		switch(p.op) {
		case this.#intcode.INT_SET_BIT:
			this.Bits[p.name1] = 1;
			break;

		case this.#intcode.INT_CLEAR_BIT:
			this.Bits[p.name1] = 0;
			break;

		case this.#intcode.INT_COPY_BIT_TO_BIT:
			this.Bits[p.name1] = this.Bits[p.name2];
			break;

		case this.#intcode.INT_SET_VARIABLE_TO_LITERAL:
			this.Integers[p.name1] = p.literal;
			break;

		case this.#intcode.INT_SET_VARIABLE_TO_VARIABLE:
			this.Integers[p.name1] = this.Integers[p.name2];
			break;

		case this.#intcode.INT_INCREMENT_VARIABLE:
			(this.Integers[p.name1])++;
			break;

		case this.#intcode.INT_SET_VARIABLE_ADD:
			this.Integers[p.name1] = this.Integers[p.name2] + this.Integers[p.name3];
			break;

		case this.#intcode.INT_SET_VARIABLE_SUBTRACT:
			this.Integers[p.name1] = this.Integers[p.name2] - this.Integers[p.name3];
			break;

		case this.#intcode.INT_SET_VARIABLE_MULTIPLY:
			this.Integers[p.name1] = this.Integers[p.name2] * this.Integers[p.name3];
			break;

		case this.#intcode.INT_SET_VARIABLE_DIVIDE:
			if(this.Integers[p.name3] != 0) {
				this.Integers[p.name1] = this.Integers[p.name2] /
				this.Integers[p.name3];
			}
			break;

		case this.#intcode.INT_IF_BIT_SET:
			if(!this.Bits[p.name1]) pc = p.name3;
			break;

		case this.#intcode.INT_IF_BIT_CLEAR:
			if(this.Bits[p.name1]) pc = p.name3;
			break;

		case this.#intcode.INT_IF_VARIABLE_LES_LITERAL:
			if(!(this.Integers[p.name1] < p.literal)) pc = p.name3;
			break;

		case this.#intcode.INT_IF_VARIABLE_EQUALS_VARIABLE:
			if(!(this.Integers[p.name1] == this.Integers[p.name2])) pc = p.name3;
			break;

		case this.#intcode.INT_IF_VARIABLE_GRT_VARIABLE:
			if(!(this.Integers[p.name1] > this.Integers[p.name2])) pc = p.name3;
			break;

		case this.#intcode.INT_ELSE:
			pc = p.name3;
			break;
			
		case this.#intcode.INT_END_OF_PROGRAM:
			return;
		}
	}
}


LoadProgram=function(fileName)
{
	
	for(let i=0;i<this.#MAX_VARIABLES;i++){
	this.Integers[i]=0;
	}
	
	for(let i=0;i<this.#MAX_INTERNAL_RELAYS;i++){
	this.Bits[i]=0;}
	
	
	for(let i=0;i<8;i++){
		this.AddrX[i]=-1;
		this.AddrY[i]=-1;
		this.AddrA[i]=-1;
		this.AddrP[i]=-1;
	}

	let code=document.getElementById("code");
	let codepos=0;
	code=code.value.split("\n");
	console.log(code);
	
	let pc;

	if(code[codepos++]!="$$LDcode"){console.log("No LDcode found");return(-1);}
	
	for(pc = 0; ; pc++) {
		let line=code[codepos++];
		if(line=="$$bits") break;
		if(line.length!=20){console.log("No Bits found");return(-1);}

		
		let b = new BinOp();
		console.log("PC:",pc);

		b.op=(this.#HexDigit(line[1]) | this.#HexDigit(line[0]) << 4| this.#HexDigit(line[2]) << 8| this.#HexDigit(line[3]) << 12);
		b.name1=(this.#HexDigit(line[5]) | this.#HexDigit(line[4]) << 4 |this.#HexDigit(line[6]) << 8| this.#HexDigit(line[7]) << 12);
		b.name2=(this.#HexDigit(line[9]) | this.#HexDigit(line[8]) << 4| this.#HexDigit(line[10]) << 8| this.#HexDigit(line[11]) << 12);
		b.name3=(this.#HexDigit(line[13]) | this.#HexDigit(line[12]) << 4| this.#HexDigit(line[14]) << 8| this.#HexDigit(line[15]) << 12);
		b.literal=(this.#HexDigit(line[17]) | this.#HexDigit(line[16]) << 4| this.#HexDigit(line[18]) << 8| this.#HexDigit(line[19]) << 12);
		
		this.Program[pc]=b;
	}
 console.log("End Bits ",codepos);

	for(;codepos<code.length;codepos++) {
		console.log(codepos);
		let line=code[codepos];
		if(line[0]=="X") {
			if('0'<=line[1]<='5'){this.AddrX[line[1]-'0']=line.split(",")[1];}
		}
		
		if(line[0]=="Y") {
			if('0'<=line[1]<='8'){this.AddrY[line[1]-'0']=line.split(",")[1];}
		}
		
		if(line[0]=="A") {
			if('0'<=line[1]<='1'){this.AddrA[line[1]-'0']=line.split(",")[1];}
		}
		
		if(line[0]=="P") {
			if('0'<=line[1]<='8'){this.AddrP[line[1]-'0']=line.split(",")[1];}
		}
		
	}
	
}


	
}