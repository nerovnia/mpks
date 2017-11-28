"use strict";

var canvas;
const enProfilElements = new Enum('None', 'OpKs', 'Opksk', 'OpKskf', 'OpKsao', 'OpKsad', 'Zemlya', 'LineElectricDirect', 'LineElectricCurve', 'LineNoElectricDirect', 'LineNoElectricCurve', 'Tupik', 'Razedinitel', 'NomOp', 'NameRazedinitel', 'KmPk', 'NumberPuti');
var isSetPaint = enProfilElements.None;

// Главный родительский графический элемент
class MainGraphElement {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.gElement = null;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getGElement() {
        return this.gElement;
    }

    //Масштаб элементов
    static get scale() {
        return 30;
    }

    //Множитель для контуров элементов
    static get factorCircuitElement() {
        return 0.25;
    }

    //Множитель для размеров элементов
    static get factorSizeElement() {
        return 1;
    }

    static get fill() {
        return 'transparent';
    }

    static get stroke() {
        return 'black';
    }

    static get strokeWidth() {
        return 1;
    }

    static get consoleLength() {
        return 3;
    }
    
    static get calcStrokeWidth() {
        return MainGraphElement.strokeWidth * MainGraphElement.scale * MainGraphElement.factorCircuitElement;
    }


}

// Опора контактной сети
class OpKs extends MainGraphElement {
    constructor(x, y) {
        super(x, y);
        this.gElement = new fabric.Circle({
            left: this.x,
            top: this.y,
            radius: OpKs.radius * (MainGraphElement.scale * MainGraphElement.factorSizeElement),
            fill: MainGraphElement.fill,
            stroke: MainGraphElement.stroke,
            strokeWidth: MainGraphElement.strokeWidth * (MainGraphElement.scale * MainGraphElement.factorCircuitElement)
        });
    }

    static get radius() {
        return 1.5;
    }

    static get diametr() {
        return OpKs.radius * 2;
    }

}

// Опора контактной сети с консолью
class OpKsk extends OpKs {
    constructor(x, y) {
        super(x, y);
        var pKons = new fabric.Line([x + OpKs.radius * MainGraphElement.scale, y, x + OpKs.radius * MainGraphElement.scale, y - MainGraphElement.consoleLength * MainGraphElement.scale], {
            strokeWidth: MainGraphElement.strokeWidth * MainGraphElement.scale * MainGraphElement.factorCircuitElement,
            stroke: MainGraphElement.stroke
            //selectable: true,
            //targetFindTolerance: true
        });
        var group = new fabric.Group([this.getGElement(), pKons], {
            left: x,
            top: y,
            angle: 0
        });
        this.gElement = group;
    }
}

// Фиксирующая опора контактной сети
class OpKskf extends OpKs {
    constructor(x, y) {
        super(x, y);
        var pKonsY2 = y - OpKskf.fixConsoleLength * MainGraphElement.scale;
        var pKons = new fabric.Line([x + OpKs.radius * MainGraphElement.scale, y, x + OpKs.radius * MainGraphElement.scale, pKonsY2], {
            strokeWidth: MainGraphElement.strokeWidth * MainGraphElement.scale * MainGraphElement.factorCircuitElement,
            stroke: MainGraphElement.stroke
            //selectable: true,
            //targetFindTolerance: true
        });
        var pFix = new fabric.Circle({
            left: x + ((MainGraphElement.strokeWidth * MainGraphElement.scale) / 2),
            radius: 1 * MainGraphElement.scale,
            top: y - ((OpKskf.fixConsoleLength + OpKs.radius + MainGraphElement.strokeWidth * MainGraphElement.factorCircuitElement) * MainGraphElement.scale) - MainGraphElement.strokeWidth * MainGraphElement.scale * MainGraphElement.factorCircuitElement,
            startAngle: 0,
            endAngle: 1 * Math.PI,
            fill: MainGraphElement.fill,
            stroke: MainGraphElement.stroke,
            strokeWidth: MainGraphElement.strokeWidth * MainGraphElement.scale * MainGraphElement.factorCircuitElement
        });
        var group = new fabric.Group([this.getGElement(), pKons, pFix], {
            left: x,
            top: y,
            angle: 0
        });

        this.gElement = group;
    }

    static get fixConsoleLength() {
    return 2;
    }

}

// Анкерная опора контактной сети
class OpKska extends OpKs {
    constructor(x, y) {
        super(x, y);
        pAnker = new fabric.Triangle({
            width: OpKska.opKskaAnkerHeight * MainGraphElement.scale,
            height: OpKska.opKskaAnkerHeight * MainGraphElement.scale,
            fill: 'black',
            left: x + (OpKs.diametr + OpKska.opKskaAnkerLength) * MainGraphElement.scale,
            top: y + (OpKs.radius + OpKska.opKskaAnkerHeight/2) * MainGraphElement.scale + (MainGraphElement.strokeWidth * MainGraphElement.scale * MainGraphElement.factorCircuitElement)/2,// + MainGraphElement.scale,// / 2,
            angle: -90
        });
        var group = new fabric.Group([this.getGElement(), pAnker], {
            left: x,
            top: y,
            angle: 0
        });
        this.gElement = group;
    }

    static get opKskaAnkerHeight() {
        return 2;
    }
    
    static get opKskaAnkerLength() {
        return 5;
    }
  
    get pAnker(){
        return this.pAnker;
    }
    /*
    set`pAnker(Anker){
        Anker = Anker;
    }
   */
};

// Анкерная опора контактной сети  с оттяжкой
class OpKskao extends OpKska {
    constructor(x, y) {
        super(x, y);
        var y = y + OpKs.radius * MainGraphElement.scale;
        var pOtyagka = new fabric.Line([x + OpKs.diametr * MainGraphElement.scale + MainGraphElement.calcStrokeWidth, y, x + OpKs.diametr * MainGraphElement.scale + MainGraphElement.calcStrokeWidth + 5 * MainGraphElement.scale, y], {
            strokeWidth: MainGraphElement.calcStrokeWidth,
            stroke: MainGraphElement.stroke
            //selectable: true,
            //targetFindTolerance: true
        });
        var group = new fabric.Group([this.getGElement(), pOtyagka], {
            left: x,
            top: y,
            angle: 0
        });
        console.log(super.pAnker.get('left'));

        this.gElement = group;
    }
}

// Анкерная опора контактной сети  с оттяжкой
class OpKskad extends OpKska {
    constructor(x, y) {
        super(x, y);
        var y1 = y + OpKs.radius * MainGraphElement.scale - MainGraphElement.calcStrokeWidth*2;
        var y2 = y1 + MainGraphElement.calcStrokeWidth*4;
        var x1 = x + (OpKs.radius * MainGraphElement.scale - MainGraphElement.calcStrokeWidth/2) +Math.sqrt(Math.pow(OpKs.radius * MainGraphElement.scale + MainGraphElement.calcStrokeWidth,2)-Math.pow((y2-y1)/2,2));
        var pOtyagka1 = new fabric.Line([x1, y1, this.pAnker.left, y1], {
            strokeWidth: MainGraphElement.calcStrokeWidth,
            stroke: MainGraphElement.stroke
            //selectable: true,
            //targetFindTolerance: true
        });
        var pOtyagka2 = new fabric.Line([x1, y2, x + OpKs.diametr * MainGraphElement.scale + MainGraphElement.calcStrokeWidth + 5 * MainGraphElement.scale, y2], {
            strokeWidth: MainGraphElement.calcStrokeWidth,
            stroke: MainGraphElement.stroke
            //selectable: true,
            //targetFindTolerance: true
        });
        var group = new fabric.Group([this.getGElement(), pOtyagka1, pOtyagka2], {
            left: x,
            top: y,
            angle: 0
        });

        this.gElement = group;
    }

}


function PaintObject(x, y) {
    var po;
    switch (isSetPaint) {
        case enProfilElements.OpKs:
            po = new OpKs(x, y).getGElement();
            break;
        case enProfilElements.Opksk:
            po = new OpKsk(x, y).getGElement();
            break;
        case enProfilElements.Opkskf:
            po = new OpKskf(x, y).getGElement();
            break;
        case enProfilElements.OpKsao:
            po = new OpKskao(x, y).getGElement();
            break;
        case enProfilElements.OpKsad:
            po = new OpKskad(x, y).getGElement();
            break;



            /*       
             
             case 'OpKsa':
             break;
             case 'Zemlya':
             break;
             case 'LineElectricDirect':
             break;
             case 'LineElectricCurve':
             break;
             case 'LineNoElectricDirect':
             break;
             case 'LineNoElectricCurve':
             break;
             case 'Tupik':
             break;
             case 'Razedinitel':
             break;
             case 'NomOp':
             break;
             case 'NameRazedinitel':
             break;
             case 'KmPk':
             break;
             case 'NumberPuti':
             break;
             */
        default:
    }

    isSetPaint = enProfilElements.None;
    if (po !== null) {
        canvas.add(po);
    }
    //    return p1 * p2;              // The function returns the product of p1 and p2

}



window.onload = function () {
    canvas = new fabric.Canvas('c');
    /*    
     var rect = new fabric.Rect({
     left: 100,
     top: 100,
     fill: 'red',
     width: 20,
     height: 20
     });
     
     canvas.add(rect);    
     */
    //var myRec = canvas.getBoundingClientRect();
    //console.log(myRec.top);

    $("#opks").on("click", function (e) {
        isSetPaint = enProfilElements.OpKs;
    });

    $("#opksk").on("click", function (e) {
        isSetPaint = enProfilElements.Opksk;
    });

    $("#opkskf").on("click", function (e) {
        isSetPaint = enProfilElements.Opkskf;
    });

    $("#opkskao").on("click", function (e) {
        isSetPaint = enProfilElements.OpKsao;
    });

    $("#opkskad").on("click", function (e) {
        isSetPaint = enProfilElements.OpKsad;
    });

    //canvas.on('mouse:down', function(options) {
    $("canvas").on('click', function (e) {
//        PaintObject(e.clientX, e.clientY);
        PaintObject(e.offsetX, e.offsetY);
    });


    /*
     document.body.addEventListener('keydown', function (event) {
     var obj;
     if (event.keyCode == 37) {
     obj = canvas.getActiveObject();
     if (!obj)
     return;
     obj.left -= 1;
     canvas.renderAll();
     }
     
     if (event.keyCode == 38) {
     obj = canvas.getActiveObject();
     if (!obj)
     return;
     obj.top -= 1;
     canvas.renderAll();
     }
     
     if (event.keyCode == 39) {
     obj = canvas.getActiveObject();
     if (!obj)
     return;
     obj.left += 1;
     canvas.renderAll();
     }
     
     if (event.keyCode == 40) {
     obj = canvas.getActiveObject();
     if (!obj)
     return;
     obj.top += 1;
     canvas.renderAll();
     }
     
     if (event.keyCode == 46) {
     alert("***************************");
     
     if (canvas.getActiveGroup()) {
     alert("+++++++++++++++++++++++++++");
     canvas.getActiveGroup().forEachObject(function (a) {
     canvas.remove(a);
     });
     canvas.discardActiveGroup();
     canvas.deactivateAll().renderAll();
     } else {
     alert("---------------------------------");
     canvas.getActiveObject().remove();
     }
     
     }
     
     });
     
     */


    //document.getElementById("content").innerHTML = 5 + 6;
    // create a rectangle object


    // "add" rectangle onto canvas

    /*    
     canvas.setBackgroundImage('http://lorempixel.com/400/400/fashion', canvas.renderAll.bind(canvas));
     $("#text").on("click", function(e) {
     text = new fabric.Text($("#text").val(), { left: 100, top: 100 });
     canvas.add(text);
     });*/
    /*
     
     $("#save").on("click", function(e) {
     $(".save").html(canvas.toSVG());
     });
     */
};
/*
 
 function PaintOpKskf(x, y) {
 var pOpKs = PaintOpKs(x, y);
 var pKons = new fabric.Line([x + 1.5 * scale, y, x + 1.5 * scale, y - 2 * scale], {
 strokeWidth: 1 * scale,
 stroke: 'black',
 selectable: true,
 targetFindTolerance: true
 });
 var pFix = new fabric.Circle({
 left: x + ((1 * scale) / 2),
 radius: 1 * scale,
 top: y - ((2 + 1.5 + 1) * scale),
 starAngle: 0,
 endAngle: 1 * Math.PI,
 fill: 'transparent',
 stroke: 'black',
 strokeWidth: 1 * scale,
 });
 
 var group = new fabric.Group([pOpKs, pKons, pFix], {
 left: x,
 top: y,
 angle: 0
 });
 return group;
 }
 
 
 function PaintOpKska(x, y) {
 var pOpKs = PaintOpKs(x, y);
 
 var pAnker = new fabric.Line([x+12,y+6,x+32,y+6], {
 strokeWidth: 2,
 stroke: 'black',
 selectable: true,
 targetFindTolerance: true
 });
 
 
 
 var pAnker = new fabric.Triangle({
 width: 2 * scale,
 height: 2 * scale,
 fill: 'black',
 left: x + 9 * scale,
 //top: y, 
 top: y + (1.5 * scale + 1 * scale) + scale / 2,
 //        top: y + (1.5*scale+1*scale-2*scale), 
 angle: -90
 //angle: 0
 });
 var group = new fabric.Group([pOpKs, pAnker], {
 left: x,
 top: y,
 });
 return group;
 }
 */
//function PaintOpKskao(x, y) {
//    var pOpKska = PaintOpKska(x, y);
/*
 var pOtyagka = new fabric.Line([x + 12, y + 1.5*scale, x + 32, y + 1.5*scale], {
 strokeWidth: 2,
 stroke: 'black',
 selectable: true,
 targetFindTolerance: true
 });*/
/*
 var pOtyagka = new fabric.Line([x + 1.5 * 2 * scale + 1 * scale, y + 1.5 * scale, x + 1.5 * 2 * scale + 1 * scale + 5 * scale, y + 1.5 * scale], {
 strokeWidth: 1 * scale,
 stroke: 'black',
 selectable: true,
 targetFindTolerance: true
 });
 var group = new fabric.Group([pOpKska, pOtyagka], {
 left: x,
 top: y,
 });
 return group;
 }
 
function PaintOpKskad(x, y) {
    var pOpKska = PaintOpKska(x, y);
    var pOtyagka1 = new fabric.Line([x + 12, y + 2, x + 32, y + 2], {
        strokeWidth: 2,
        stroke: 'black',
        selectable: true,
        targetFindTolerance: true
    });
    var pOtyagka2 = new fabric.Line([x + 12, y + 10, x + 32, y + 10], {
        strokeWidth: 2,
        stroke: 'black',
        selectable: true,
        targetFindTolerance: true
    });
    var group = new fabric.Group([pOpKska, pOtyagka1, pOtyagka2], {
        left: x,
        top: y,
    });
    return group;
}
*/