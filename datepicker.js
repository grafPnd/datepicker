/**
 * Created by Graf on 30.10.13.
 */
(function(){
    'use strict';
    function init(paramData){
        var
            inp=$(paramData.self),
            val=inp.val()||inp.html(),//start value of data to change
            master=$('<div/>'),
            mn=['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентрябрь','Октябрь','Ноябрь','Декабрь'],
            wd=['Пн','Вт','Ср','Чт','Пт','Сб','Вс'],
            mnn=['31','28','31','30','31','30','31','31','30','31','30','31'],//days in month array (variable)
            mnl=['31','29','31','30','31','30','31','31','30','31','30','31'],//days in month array (variable)
            marr,//days in month array (in current year)
            now = new Date,
            scd=now.getDate(),//static current day
            scm=now.getMonth(),//static current month
            scy=now.getFullYear(),//static current year
            ccm=now.getMonth(),//changeable current month
            ccy=now.getFullYear(),//changeable current year
            selectedd,//selected day
            selectedm,//selected month
            selectedy;//selected year


        function refresh(){

            var
                cell,
                sd=now.getDate(),
                td=new Date(),
                cd,d;
            td.setDate(1);
            td.setFullYear(ccy);
            td.setMonth(ccm);
            cd=td.getDay();
            if (cd==0)cd=6; else cd--;
            marr=((ccy%4)==0)?mnl:mnn;
            for(d=1;d<=42;d++){
                cell=$('.j_cell'+d,master)
                if (d > cd && (d <= cd-(-marr[ccm]))){//not empty cell
                    cell
                        .html(d-cd)
                        .removeClass('dtp_selected dtp_today dtp_weekend')
                        .addClass('dtp_cell');
                    if (scm == ccm && scd == (d-cd) && scy == ccy)//today
                        cell.addClass('dtp_today');
                    if (ccm == selectedm && ccy == selectedy && selectedd == (d-cd) )//selected date
                        cell.addClass('dtp_selected');
                    if(cell.hasClass('j_weekend'))//weekend
                        cell.addClass('dtp_weekend');
                }
                else{//empty cell
                    cell
                        .empty()
                        .removeClass('dtp_selected dtp_today dtp_weekend')
                        .addClass('dtp_cell');
                }
            }
        }

        function calendHeader(){
            return'<div class="s_string">'+
                '<span align="center">'+
                '<span class="j_downmonth s_pointer dtp_dcontroller">&laquo;</span>&nbsp;&nbsp;'+
                '<span id="j_month" class="dtp_dcontroller">'+mn[ccm]+'</span>'+
                '&nbsp;<span align="right" class="j_upmonth s_pointer dtp_dcontroller">&raquo;</span>'+
                '&nbsp;&nbsp;<span class="j_downyear s_pointer dtp_dcontroller">&lt;</span>&nbsp;'+
                '<span id="j_year" class="dtp_dcontroller">'+ccy+'</span>'+
                '&nbsp;<span class="j_upyear s_pointer dtp_dcontroller">&gt;</span>&nbsp;'+
                '</span>&nbsp;'+
                '</div>';
        }

        function upmonth(s){
            marr=((ccy%4)==0)?mnl:mnn;
            ccm+=s;
            if (ccm>=12){
                ccm-=12;
                ccy++;
            }
            else if(ccm<0){
                ccm+=12;
                ccy--;
            }
            $('#j_month').html(mn[ccm]);
            $('#j_year').html(ccy);
            refresh();
        };

        function addnull(d,m,y){
            d=d<10?'0'+d:d;
            m=m<10?'0'+m:m;
            return d+'-'+m+'-'+y;
        };
        function render(){
            var
                kk,tt,num,result='';
            if(val)
                val=val.split('-');
            if(val.length==3){
                selectedd=parseInt(val[0],10);
                selectedm=parseInt(val[1],10)-1;
                selectedy=parseInt(val[2],10);
            }

            result+=calendHeader()+
                '<div class="s_string">'+
                '<div class="s_lwb dtp_dcell">'+wd[0]+'</div>'+
                '<div class="s_lwb dtp_dcell">'+wd[1]+'</div>'+
                '<div class="s_lwb dtp_dcell">'+wd[2]+'</div>'+
                '<div class="s_lwb dtp_dcell">'+wd[3]+'</div>'+
                '<div class="s_lwb dtp_dcell">'+wd[4]+'</div>'+
                '<div class="s_lwb dtp_dcell">'+wd[5]+'</div>'+
                '<div class="s_lwb dtp_dcell">'+wd[6]+'</div>'+
                '</div>';
            for(kk=1;kk<=6;kk++){
                result+='<div class="s_string">';
                for(tt=1;tt<=7;tt++){
                    num=7*(kk-1)-(-tt);
                    if(tt>5)
                        result+='<div class="s_lwb j_cell j_cell'+num+' j_weekend"></div>';
                    else
                        result+='<div class="s_lwb j_cell j_cell'+num+'"></div>';
                }
                result+='</div>';
            }
            master
                .addClass('dtp_tbl s_hidden')
                .append(result);
            inp
                .after(master)
                .on('click',function(e){
                    var
                        self=$(this),
                        iw=self.width(),
                        ih=self.height(),
                        margin=15,
                        w=160,h=180,
                        x=e.clientX-w-e.offsetX-margin<0?e.clientX+(iw-e.offsetX)+margin:e.clientX-w-e.offsetX-margin,
                        y=e.clientY-h-e.offsetY-margin<0?e.clientY+(ih-e.offsetY)+margin:e.clientY-h-e.offsetY-margin;
                    master
                        .removeClass('s_hidden')
                        .css({left:x,top:y,width:w,height:h})
                });
            refresh();
        };
        function eventer(){
            master
                .on('click','.j_cell',function(){
                    var
                        d=parseFloat($(this).text(),10),
                        result;
                    if(isNaN(d))
                        return;

                    selectedd=d;
                    selectedm=ccm;
                    selectedy=ccy;
                    result=addnull(d,ccm+1,ccy);

                    if(paramData.self.tagName.toLowerCase()=='input')
                        inp.val(result);
                    else
                        inp.html(result);
					if(paramData.apply){
						if(paramData.apply.tagName){
							if(paramData.apply.tagName.toLowerCase()=='input')
								$(paramData.apply).val(result);
							else
								$(paramData.apply).html(result);
						}
						else if(paramData.apply[0].tagName){
							if(paramData.apply[0].tagName.toLowerCase()=='input')
								$(paramData.apply).val(result);
							else
								$(paramData.apply).html(result);						
						}
					}

                    master.addClass('s_hidden')
                    refresh();
                })
                .on('click','.j_downmonth',function(){
                    upmonth(-1);
                })
                .on('click','.j_upmonth',function(){
                    upmonth(1);
                })
                .on('click','.j_downyear',function(){
                    upmonth(-12);
                })
                .on('click','.j_upyear',function(){
                    upmonth(12);
                });
        };
        render();
        eventer();
    };
    jQuery.fn.extend({
        callendarise: function(d) {
            return this.each(function(){
				var a=d||{};
				a.self=this;
                init(a);
            });
        }
    });
}())