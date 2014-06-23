/*
*作者：王文杰
*时间：2014-02-10
*版本：v1.0
*说明：实现了模拟浏览器滚动条的功能。
*使用方式：		
*		var scrollbar=wjscroll("DOMID"); 
*		var scrollbar=wjscroll(DOM);
*		var scrollbar=wjscroll(DOM,option);
*		option //可以定义一个滚动条的样式，请参照默认样式。
*		{
*			wjscroll_ctrl:{width:"10px",color:"#fff",position:"absolute",right:"0px",top:"0px",height:"100%"},//右侧滚动条容器的样式
*			wjscroll_subline:{
*			filter:"alpha(opacity=7)",
*			opacity:"0.07",
*			width:"4px",
*			color:"#000",
*			height:"100%",
*			position:"absolute",
*			left:"50%",top:"0px",margin:"0 -2px",display:""
*			},//辅助线样式
*			wjscroll_up_arrow:null,
*			wjscroll_bar:{width:"80%",border:"1px solid #d6d6d6",color:"#fff",margin:"0 1px",position:"absolute",top:"0px"},//滚动块
*			wjscroll_down_arrow:null
*		}
*		在创建滚动条的DOM上会赠送一个 setScrollTop(y)方法用于设置滚动的位置。
*		ex: DOM.setScrollTop(100);就会将滚动滑块向下滚动100px.
*
*/
(function(){	
	var 
	class2type = {},
	core_toString=Object.prototype.toString,
	core_slice=Array.prototype.slice,
	wjscroll=function(id,options){
		return new wjscroll.fn.init(id,options);
	};
	//定义构造函数
	wjscroll.fn=wjscroll.prototype={
		constructor:wjscroll,
		init:function(elem,options){
			this.con=typeof(elem)!="string"?elem:document.getElementById(elem);
			this.set(options);
			this.scroll=this.create();
			this.readjustBarHeight();
			this.regEvent();
		},
		set:function(options){
				this.extend(true,options);
		},
		//创建滚动区，滚动条
		create:function(){
			var a,b,c,d,e,f,g,scroll={},
			con=this.con,
			cen=ce("div"),//滚动内容
			ctrl=ce("div");//handle 滚动条
			wrap(con,cen);
			ap(con,cen);
			ap(con,ctrl);
			//设置容器定位方式
			css(con,{position:"relative",overflow:"hidden"});
			css(cen,{position:"relative",top:"0px",width:"100%"});
			//创建滚动条
			css(ctrl,this.wjscroll_ctrl);
			if(!!this.wjscroll_up_arrow){
				a=cecss(this.wjscroll_up_arrow);
				ap(ctrl,a);
				scroll.up_arrow=a;
			}
			if(!!this.wjscroll_down_arrow){
				a=cecss(this.wjscroll_down_arrow)
				ap(ctrl,a);
				scroll.down_arrow=a;
			}
			if(!!this.wjscroll_subline){
				a=cecss(this.wjscroll_subline);
				ap(ctrl,a);
				scroll.subline=a;
			}
			if(!!this.wjscroll_bar){//创建滑动条
				e=this.wjscroll_bar.border;
				f=this.wjscroll_bar.color;
				g={};
				wjscroll.extend(g,this.wjscroll_bar,{border:"",color:""});

				a=cecss(g);
				b=cecss({borderLeft:e,borderRight:e,borderTop:e,margin:"0 2px",height:"1px",color:f||"",fontSize:"0px"});
				c=cecss({borderLeft:e,borderRight:e,margin:"0 1px",height:"1px",color:f||"",fontSize:"0px"});
				d=cecss({borderLeft:e,borderRight:e,height:"100%",color:f||"",fontSize:"0px"});
				ap(a,b);ap(a,c);ap(a,d);
				ap(ctrl,a);
				b=cecss({borderLeft:e,borderRight:e,borderBottom:e,margin:"0 2px",height:"1px",color:f||"",fontSize:"0px"});
				c=cecss({borderLeft:e,borderRight:e,margin:"0 1px",height:"1px",color:f||"",fontSize:"0px"});
				ap(a,c);ap(a,b);
				a.slider=d;
				scroll.bar=a;
			}
			wjscroll.extend(scroll,{cen:cen,ctrl:ctrl});
			return scroll;
		},
		//重新计算滚动内容位置
		readjustContent:function(){
			var 
				a=this.scroll,
				b=a.cen,
				c=a.bar,
				g=a.ctrl,
				d,e,f;
				d=parseInt(c.style.top||0);
				e=g.clientHeight;
				f=d*b.clientHeight/e;
				//alert(a+","+d+","+e+","+f)
				css(b,{top:-f+"px"});
		},
		//重新计算滚动条的长短
		readjustBarHeight:function(){
			var a,b,c,d,e,f,t=this;
			d=this.con.clientHeight;
			b=this.scroll.ctrl;
			c=this.scroll.cen.clientHeight;
			a=this.calBarHeight();
			e=this.scroll.bar;
			f=e.slider;
			if(c<=d){
				css(b,{display:"none"});
			}else{
				//console.log(a);
				css(b,{display:""});
				a-=e.clientHeight-f.clientHeight;	//减去上下圆角的高度
				//b=this.calBarPosition()+"px";
				css(this.scroll.bar.slider,{height:a+"px"});	
			}
			//css(this.scroll.bar,{top:b});
			setTimeout(function(){t.readjustBarHeight()}, 5);
		},
		calBarHeight:function(){
			var 
				a=this.scroll,
				b=this.con,
				c=a.bar,
				e,f;
			e=b.clientHeight;
			f=a.cen.clientHeight;
			return e*e/f; 

		},
		calBarPosition:function(y){
			var 
				a=this.scroll,
				b=a.ctrl,
				c=a.bar,
				d,e,f;
			e=y||Math.abs(parseInt(a.cen.style.top||0,10));
			f=a.cen.clientHeight;
			d=b.clientHeight;
			d*=e/f;
			return parseInt(d);
				
		},
		//注册事件
		regEvent:function(){
			var
				t=this,
				a=this.con,
				b=this.scroll,
				isfirefox="MozBinding" in document.documentElement.style,
				//opera浏览器
                opera = window.oprea && navigator.userAgent.indexOf('MSIE') === -1,
				wheel=isfirefox?"DOMMouseScroll":"mousewheel",
				timers=[];
			Event.add(a,"mouseout",function(){
				css(b.subline,{filter:"alpha(opacity=7)",opacity:"0.07"});
			})
			Event.add(a,"mouseover",function(){
				css(b.subline,{filter:"alpha(opacity=12)",opacity:"0.12"});
			})
			//滚轮事件
			Event.add(a,wheel,function(evt){
				if(evt.wheelDelta){
					delta=opera?-evt.wheelDelta/120 : evt.wheelDelta/120;
				}else{
					delta=evt.detail*(-40)/120;
				}
				t.dealmouseWheel(evt,delta);
			});
			//鼠标按下事件：一种是开始拖动滑块，一种是点击滚动条空白处
			Event.add(b.ctrl,"mousedown",function(evt){
				evt=window.event||evt;
				var target=evt.target||evt.srcElement,
					move=target.parentNode==b.bar,
					y;
					if(move){//拖拽滑块
						t.dealdrag(evt);
						Event.stopEvent(evt);
					}else{//点空白
						y=evt.clientY;
						y=parseInt(y-getOffset(b.ctrl).top);
						timers.firing=true;
						t.dealMouseDown(y,timers);
					}	
			});
			Event.add(b.ctrl,"mouseup",function(){
				timers.firing=false;
				each(timers,function(i,timer){clearTimeout(timer);timers.pop(timer);});
			});
			t.con.setScrollTop=function(a){t.goto(a);}//为容器增加 设置滚动位置的方法
		}	
	};
	//定义为全局变量
	window.wjscroll=wjscroll;
	wjscroll.fn.init.prototype=wjscroll.prototype;

//---定义扩展函数-----------------------------
	wjscroll.extend=wjscroll.fn.extend=function(){
		var options, name, src, copy, copyIsArray, clone,
		target=arguments[0]||{},
		i=1,
		length=arguments.length;
		deep=false;

		if(typeof target==="boolean"){
			deep=target;
			target=arguments[1]||{};
			i=2;
		}
		if(typeof target!="object" && !isFunction(target)){
			target={};
		}
		if(length===i){
			target=this;
			--i;
		}
		for(;i<length;i++){
			if((options=arguments[i])!=null){
				for(name in options){
					src=target[name];
					copy=options[name];
					if(target===copy)
						continue;
					if(deep&&copy&& (typeof copy=="object" ||(copyIsArray=isArray(copy)))){
						if(copyIsArray){
							copyIsArray=false;
							clone=src&& isArray(src)?src:[];
						}else{
							clone=src&& typeof src=="object"?src:{};
						}
						target[name]=wjscroll.extend(deep,clone,copy);
					}else if(copy!=undefined){
						target[name]=copy;
					}
				}
			}
		}
		return target;
	};
	//定义必要属性
	wjscroll.fn.extend({
		wjscroll_ctrl:{width:"10px",color:"#fff",position:"absolute",right:"0px",top:"0px",height:"100%"},//右侧滚动条容器的样式
		wjscroll_subline:{
			filter:"alpha(opacity=7)",
			opacity:"0.07",
			width:"4px",
			color:"#000",
			height:"100%",
			position:"absolute",
			left:"50%",top:"0px",margin:"0 -2px",display:""
		},//辅助线样式
		wjscroll_up_arrow:null,
		wjscroll_bar:{width:"80%",border:"1px solid #d6d6d6",color:"#fff",margin:"0 1px",position:"absolute",top:"0px"},//滚动块
		wjscroll_down_arrow:null
	});
	//定义公共方法
	wjscroll.fn.extend({
		//扩展事件处理函数
		dealmouseWheel:function(evt,delta){
			evt=window.event||evt;
				var 
					a=this.con,
					b=this.scroll,
					min=0,
					cur,
					top,
					speed=50;
					max=this.getMax(),
					cur=this.getCur();//获取滚动条的位置
			//alert(max+","+b.cen.style.top);
			 //向上滚动
            if(delta > 0) {
                top = cur - speed 
                if(top < min) {
                    top = min;
                }
            }else{//向下滚动
                top = cur + speed 
                if(top >= max) {
                    top = max;
                }
            }
			css(b.bar,{top:top+"px"});
			this.readjustContent();
			//t.readjustment();
			Event.stopEvent(evt);
		},
		dealMouseDown:function(y,keepMove){
			var 
				t=this,
				a=this.con,
				b=this.scroll,
				timer,
				c,d=1,e,f,g=24,h=b.bar.clientHeight,i=b.ctrl.clientHeight;
			(!keepMove)&&(y-=10);
			if(y<h&& !keepMove){
				y=0;
			}
			if((i-y)<h){
				y=i;
			}
			function move(keepMove){
				clearTimeout(timer);
				c=parseInt(b.bar.style.top||0);
				if(d<g&&(keepMove||b.ctrl.firing==true)){
					//赋值
					c=parseInt(Event.linear(d++,c,y-c,g));
					//console.log(c+","+y);
					//判断是否越界
					if((c+h)>i){
						c=t.getMax();
						d=g;
					}
  					css(b.bar,{top:c+"px"});
					t.readjustContent();
					//继续移动
					timer=setTimeout(move,10,keepMove);
				}
			}
			move(keepMove);
		},
		getCur:function(){
			return parseInt(this.scroll.bar.style.top||0);
		},
		goto:function(y){//将滚动条滚动到指定位置
			var t=this,a;
			y=y
			a=t.calBarPosition(y);
			t.dealMouseDown(a,true);
		},
		getMax:function(){
			var 
				a=this.con,
				b=this.scroll,
				max;
				max=b.ctrl.clientHeight-b.bar.clientHeight;
				return max;
				
		},
		dealdrag:function(event){
			var 
				t=this,
				a=this.con,
				b=this.scroll,
				c=b.bar.clientHeight,
				max=t.getMax(),
				o=event.clientY, //记录当前值
				top=parseInt(b.bar.style.top||0);

			Event.add(b.ctrl,"mousemove",mv);
			Event.add(b.ctrl,"mouseup",mp);
			function mv(evt){
				evt=evt||window.event;
				var cur;
				cur=evt.clientY;
				top=top+cur-o;
				o=cur;
				top=top<0?0:(top>max)?max:top;
				css(b.bar,{top:top+"px"});
				t.readjustContent();
				b.bar.setCapture&&b.bar.setCapture();
			}
			function mp(evt){
				b.bar.releaseCapture&&b.bar.releaseCapture();
				evt=evt||window.event;
				Event.remove(b.ctrl,"mousemove",mv);
				Event.remove(b.ctrl,"mouseup",mp);

			}
		}

	});
	//Event	对象
	var Event={
		add:function(elem,type,fn){

			!!elem&&elem.addEventListener?elem.addEventListener(type,fn,false):elem.attachEvent("on"+type,fn);
		},
		remove:function(elem,type,fn){
			!!elem&&elem.removeEventListener?elem.removeEventListener(type,fn,false):elem.detachEvent("on"+type,fn);
		},
		stopEvent:function(a){
			//取消事件浮升
			!!a.stopPropagation&&a.stopPropagation();
			!!a.cancelBubble && (a.cancelBubble=true);
			//阻止默认事件
			!!a.preventDefault && a.preventDefault();
			!!a.returnValue && (a.returnValue=false);
		},
		linear: function(t,b,c,d){ return c*t/d + b; },
		easeIn: function(t, b, c, d) {
            return c * (t /= d) * t + b;
        },
        easeInOut: function(t,b,c,d){
			if ((t/=d/2) < 1) return c/2*t*t + b;
			return -c/2 * ((--t)*(t-2) - 1) + b;
		}
	};
	//工具函数
	function cecss(value){var a=ce("div");css(a,value);return a; };
	function ce(a){return document.createElement(a);};
	function ap(a,b){a.appendChild(b);};
	function cdf(){return document.createDocumentFragment();};
	function isArray(obj){return type(obj)=="array";};
	function isFunction(obj){return type(obj)=="function";};
	function type(obj){	return obj==null?String(obj):class2type[core_toString.call(obj)]||"object";};
	function css(elem,value){
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}
		var 
		style=elem.style;
		for(var i in value){
			try{
				if(i=="color"){
					style["background"]=value[i];
				}else{
					style[i]=value[i];
				}
				
			}catch(e){}
		}
	}
	function wrap(a,b){
		var elem=a.firstChild,r=[];
		for(;elem;elem=elem.nextSibling){
			if ( elem.nodeType === 1 ) {
				r.push(elem);
			}
		}
		for(var i=0;i<r.length;i++){
			ap(b,r[i]);
		}
	}
	function each(obj,callback){
		var name,isObj,length,i=0;
		length=obj.length;
		isObj=length===undefined||isFunction(obj);
		if(isObj){
			for(name in obj){
				callback.call(obj[name],name,obj[name]);
			}
		}else{
			for(;i<length;){
				callback.call(obj[i],i,obj[i++]);
			}
		}
	};
	function getOffset(elem) {
            var body = document.body,
                docElem = document.documentElement;

            if('getBoundingClientRect' in document.documentElement) {
                var box;

                try {
                    box = elem.getBoundingClientRect()
                }catch(e) {}

                if(!box || !elem.parentNode) {
                    return box ? {top: box.top, left: box.left} : {top: 0, left: 0}
                }

                var win = window,
                    clientTop = docElem.clientTop || body.clientTop || 0,
                    clientLeft = docElem.clientLeft || body.clientLeft || 0,
                    scrollTop = win.pageYOffset || docElem.scrollTop || body.scrollTop,
                    scrollLeft = win.pageXOffset || docElem.scrollLeft || body.scrollLeft,
                    top = box.top + scrollTop - clientTop,
                    left = box.left + scrollLeft - clientLeft; 

                return {top: top, left: left}
            }else{
                var offsetParent = elem.offsetParent,
                    top = elem.offsetTop,
                    left = elem.offsetLeft;

                while((elem = elem.parentNode) && elem !== body && elem !== docElem) {
                    if(elem === offsetParent) {
                        top = elem.offsetTop
                        left = elem.offsetLeft

                        offsetParent = elem.offsetParent
                    }
                }

                return {top: top, left: left}
            }
        };
	//枚举javascript的对象类型
	each("Boolean Number String Function Array Date RegExp Object".split(" "),function(i,name){
		class2type["[object "+name+"]"]=name.toLowerCase()});
})()
