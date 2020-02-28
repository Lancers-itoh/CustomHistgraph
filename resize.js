//配列宣言などは関数の外でも可能だが、documentから要素を取得するには、イベントバンドラを利用しHTML側から呼び出す必要がある。
//関数の中で要素を取得する、あるいは、window.onload で取得。


var Data = new Array();
var NumberOfMoveImg;
var DataEndIndex;
var year_group = new Array();
var img_position = new Array();
var $img_div = new Array ();
var img_div_width = 160;
var $moveimgs;
var number_of_frame_in;
let interval_time = 2000;
let transition_time = 1000;
let MaxConstSize = 200;
var max_size = 0;
var is_first_time = true;
var encoder;
var RECORD_signal = false;
const MaxHeightIn = [];
var WperH_ratio;
var Data_in = [];
var distance_between_imgs = 20;
var max_size_on_this_rank = [];


/*const は読み取り専用の変数として宣言する*/

function func1() {
    number_of_frame_in =  parseInt(document.getElementById("input_message1").value);
    document.getElementById("input_message1").value = number_of_frame_in;

    if(number_of_frame_in > NumberOfMoveImg){
        alert("最大数を超えています");
    }else{
        Initialization(false,NaN);
    }
}

function func2() {
    interval_time = parseInt(document.getElementById("input_message2").value);
    document.getElementById("input_message2").value = interval_time;
}

function func3() {
    transition_time = parseInt(document.getElementById("input_message3").value);
    document.getElementById("input_message3").value = transition_time;
}


function func4() {
    $moveimgs = document.getElementsByClassName('moveimg');
    $labels = document.getElementsByClassName('label');
    MaxConstSize = parseInt(document.getElementById("input_message4").value);
    document.getElementById("input_message4").value = MaxConstSize;
    Initialization(false,NaN);
}

function func5() {
    distance_between_imgs = parseInt(document.getElementById("input_message5").value);
    document.getElementById("input_message5").value = distance_between_imgs;
    Initialization(false,NaN)
}


function Initialization(isfirst, $ID){
    $title = document.getElementById('title');
    $moveimgs = document.getElementsByClassName('moveimg');
    $labels = document.getElementsByClassName('label');
    $values = document.getElementsByClassName('value');
    //img_position = img_div_coordinate_in(3);
    var this_time_sort_arr = [];
    var height_as_px = [];
    for(var time=0; time < DataEndIndex-3; time++){
            //this_time_sort_arr[time] = Data_in[time].slice().sort(compareFunc);
        var this_time_sort_arr = Data_in[time].slice().sort(compareFunc);
        var max_on_this_arr = Math.max(...this_time_sort_arr);
        var tmp_arr = [];
        for(var i=0; i <NumberOfMoveImg; i++){
                value = Math.round((MaxConstSize/max_on_this_arr) * this_time_sort_arr[i]);
                tmp_arr.push(value);
        }
        height_as_px.push(tmp_arr);
        function compareFunc(a, b) {
            return a - b;
        }
    }
    max_size_on_this_rank = [];
    const transpose = a => a[0].map((_, c) => a.map(r => r[c]));
    var rank_arr = transpose(height_as_px);
    for(var rank=0; rank < rank_arr.length; rank++){
        var max = Math.max(...rank_arr[rank]);
        max_size_on_this_rank.push(max);
    }

    img_position = img_div_coordinate_like(max_size_on_this_rank, false, NaN)
    //$title.style = "top:" + title_pos + 'px';
    tmp = img_position.filter(item => item > 0)[0];
    tmp2 = img_position.indexOf(tmp);
    pos = max_size_on_this_rank[tmp2];
    title_height = 210 + pos;
    if(title_height > 730){
        title_height = 730;
        console.log("Max");
    }
    $title.style = "bottom:" + title_height + 'px';
    for(var i=0; i < NumberOfMoveImg; i++ ){
        $labels[i].textContent = Data[i+1][1];
        var Max  = MaxHeightIn[0];
        var value = (MaxConstSize/Max) * Data[i+1][3];
        $moveimgs[i].style = 'height:' + value +'px';
        rank = rank_gen(3, i);
        $img_div[i].style = 'left:' + img_position[rank] + 'px';
        $values[i].style = 'bottom:' + (value + 10) + 'px';
        console.log($values[i].style);
    }
    if(isfirst){
        clearInterval($ID);
    }
}

function img_div_coordinate_like(data_in_this_time, isfirst, $ID){
    var this_time_position = [];
    var left = 20;
    var Max = Math.max(...data_in_this_time);
    var enter_threshold_index = NumberOfMoveImg - number_of_frame_in; 
    //leftに追加する値を固定化すればいいだけ
    //width < img_div_width 画像幅がimg_div_widthより小さい場合無条件でsize = img_div_widthとなる*/
    console.log(enter_threshold_index);
    for(var i=0; i < data_in_this_time.length; i++){      
        if(i == enter_threshold_index){
            var self_value = Math.round((MaxConstSize/Max) * data_in_this_time[i]);
            var self_width = self_value*WperH_ratio;
            if(self_width < img_div_width){
                self_width = img_div_width;
            }
            left = 20 + self_width/2;
            this_time_position.push(left);
        }else if( i >  enter_threshold_index){
            var former_value = Math.round((MaxConstSize/Max) * data_in_this_time[i-1]);
            var former_width = former_value*WperH_ratio;
            if(former_width < img_div_width){
                former_width = img_div_width;
            }
            var self_value = Math.round((MaxConstSize/Max) * data_in_this_time[i]);
            var self_width = self_value*WperH_ratio;
            if(self_width < img_div_width){
                self_width = img_div_width;
            }
            left = left + (former_width/2 + self_width/2) + distance_between_imgs;
            this_time_position.push(left);
        }else{
            out = -(200 + MaxConstSize*WperH_ratio);
            this_time_position.push(out);
        }
    }
    img_position =  this_time_position;
    console.log("###");
    console.log(img_position);
    if(isfirst){
        clearInterval($ID);
    }else{
        return(img_position);
    }
}


window.onload = function() {  

    var form = document.forms.myform;

    form.myfile.addEventListener( 'change', function(e) {
        var result = e.target.files[0];
        var reader = new FileReader();
        reader.readAsText( result, 'shift-jis' );
        //reader.readAsText( result);
        reader.addEventListener( 'load', function() {

            var prerowdata = reader.result.split('\r\n');
            var rowdata;
            //最終行に,がつくことがあるので除外する。
            for(var i=0; i< prerowdata.length; i++){
                if(prerowdata[i].split(',').length <= 1){
                    //rowdata = rowdata.splice(rowdata.length-1);
                    rowdata = prerowdata.slice(0, i);
                    break;
                }
                if(i == prerowdata.length - 1){
                    rowdata = prerowdata;
                }
            }
            var GIF_div = document.getElementById("GIF");
            var submax_size = new Array();

            for(let i=0; i < rowdata.length; i++){
                var split_row = rowdata[i].split(',');
                if(i != 0){
                    num_arr = split_row.splice(3).map( str => parseInt(str, 10) );
                    submax = Math.max(...num_arr);
                    submax_size.push(submax);
                }
                Data.push(rowdata[i].split(','));
            }
            form.output.textContent = Data;
            max_size = Math.max(...submax_size);

            NumberOfMoveImg = rowdata.length - 1;
            //アニメーションで表示される画像の数 ヘッダ分の１つを除外している。
            DataEndIndex = Data[0].length;
            //アニメーションで表示される画像の数 ヘッダ分の１つを除外している。
            number_of_frame_in = NumberOfMoveImg;

            const transpose = a => a[0].map((_, c) => a.map(r => r[c]));
            var transposed_array = transpose(Data);
            for(var i=3; i < DataEndIndex; i++){
                value_array = transposed_array[i].splice(1).map( str => parseInt(str, 10) );      
                Data_in.push(value_array);
                MaxHeightIn.push(Math.max(...value_array));
            }
            

            function CreateMoveImgGroup(i){
                var div = document.createElement('div');
                div.className = 'inline_block';
                div.id = ("img" + i);
                var p1 = document.createElement('p');
                //p1.className = "label";
                p1.className = "value";
                p1.textContent = Data[i+1][4];
                var img = document.createElement('img');
                img.src = Data[i+1][0];
                img.style = "height: 45px;" ;
                img.className = 'moveimg ' + Data[i+1][2];
                var p2 = document.createElement('p');
                //p2.className = "value";
                p2.className = "label";
                p2.textContent = Data[i+1][1];
                div.appendChild(p1);
                div.appendChild(img);
                div.appendChild(p2);
                GIF_div.appendChild(div);
            }
            for(var i=0; i < NumberOfMoveImg; i++ ){
                CreateMoveImgGroup(i);
            }
            /*とりあえず作って、座標をフレームアウトさせる*/

            var $moveimgs = document.getElementsByTagName('img');
            for(var i=0; i< $moveimgs.length; i++){
                var classname = "img" + i;
                $img_div[i] = document.getElementById(classname);
            }

            /*縦横比の取得*/
            var element = $moveimgs[0];
            var intervalId = setInterval( function () {
                if ( element.complete ) {
                    var width = element.naturalWidth ;
                    var height = element.naturalHeight ;
                    WperH_ratio = width/height;
                    console.log(WperH_ratio);
                    clearInterval( intervalId ) ;
                }
            }, 500 ) ;
             
            /*初期位置生成*/
            var a = setInterval( function() {img_div_coordinate_like(max_size_on_this_rank, true, a)}, 500);
            /*縦横比を元に初期化*/
            var $intervalID2 = setInterval(function(){Initialization(true, $intervalID2)} ,600);

        })
    })
}




function resize_play(){
    disabledButtons( true );
    if(is_first_time){
        var $moveimgs = document.getElementsByClassName('moveimg');
        for(var i=0; i< $moveimgs.length; i++){
            var classname = "img" + i;
            $img_div[i] = document.getElementById(classname);
            var tar_pos = window.getComputedStyle($img_div[i], null).getPropertyValue('left');
            img_position.push(tar_pos);
        }
        is_first_time = false;
    }

    //ここであらかじめ位置情報を記憶してるけどいらないかも
    if(is_first_time){
        var $moveimgs = document.getElementsByClassName('moveimg');
        for(var i=0; i< $moveimgs.length; i++){
            var classname = "img" + i;
            $img_div[i] = document.getElementById(classname);
            var tar_pos = window.getComputedStyle($img_div[i], null).getPropertyValue('left');
            img_position.push(tar_pos);
        }
        is_first_time = false;
    }

    var $targetElements = document.getElementsByClassName('moveimg');
    var $targetValues = document.getElementsByClassName('value');
    var $title = document.getElementById('title');
    var $labels = document.getElementsByClassName('label');
    
    
    for(var k=3; k < (DataEndIndex); k++){
        setTimeout(animation, (transition_time + interval_time)*(k-3), k);
    }

    function animation(time){
        var $intervalID  =new Array();
        var $intervalID2  =new Array();
        var speed2 = new Array();
        var Max  = MaxHeightIn[time-3];
        //var img_position = img_div_coordinate_in(time);

        //setInterval をforstatementで使うときは、変数iをクロージャでキープする( https://qiita.com/yam_ada/items/2867985bcb6b77288548 )
        
        for(var i=0; i < NumberOfMoveImg; i++){
            /*setintervalを呼び出す間隔は一定にして、速度はvで調整する*/
             speed2 = 1;
             speed1 = 1;
            (function(index) {
                $intervalID[index] = setInterval(function(){speed_manager_expand(index, time, $intervalID[index])},speed1);
            })(i);
            (function(index) {
                $intervalID2[index] = setInterval(function(){speed_manager_location(index, time, $intervalID2[index])},speed2);
            })(i);
        }
        $title.textContent = Data[0][time];

        v = 5;
        function speed_manager_expand(i, time, $ID,v){
            var value = Math.round((MaxConstSize/Max) * Data[i+1][time]);
            var height = parseInt($targetElements[i].style.height);
            var textvalue = parseInt($targetValues[i].textContent);
            if(height != value){
                if(i == 5){
                    console.log("EXPAND")
                }
                switch(height > value){
                    case true :
                            if((height - value) >= v){
                                height = height - v;
                            }else{
                                height = height - 1;
                            }
                            $targetElements[i].style.height = height + 'px';
                            newheight =  parseInt($targetElements[i].style.height)+ 10;
                            $targetValues[i].style = 'bottom:' + newheight +'px';
                            $targetValues[i].textContent = Math.round(height*Max/MaxConstSize);
                        break;
                    case false :
                        if((height - value) <= v){
                            height = height + v;
                        }else{
                            height = height + 1;
                        }
                        $targetElements[i].style.height = height + 'px';
                        newheight =  parseInt($targetElements[i].style.height)+ 10;
                        $targetValues[i].style = 'bottom:' + newheight +'px';
                        $targetValues[i].textContent = Math.round(height*Max/MaxConstSize);
                        break;
                }
            }else{    
                if(i == 5){
                    console.log("END");
                }
                $targetValues[i].textContent = Data[i+1][time];
                clearInterval($ID);
            }
        }
  
    /*速さ*/
        
        function speed_manager_location(i, time, $ID){
            var value = Math.round(parseInt(img_position[rank_gen(time, i)]));
            var position = parseInt(window.getComputedStyle($img_div[i], null).getPropertyValue('left'));
            if(position != value){
                switch(position > value){
                    case true :
                        if((position - value) >= v){
                            position = position - v;
                        }else{
                            position = position - 1;
                        }
                        $img_div[i].style.left  =  position + 'px';
                        break;
                    case false :
                        if((position - value) <= v){
                            position = position + v;
                        }else{
                            position = position + 1;
                        }
                        $img_div[i].style.left = position + 'px';
                        break;
                }
            }else{
                clearInterval($ID);
            }
        }
        
    }
    disabledButtons( false );
}

function rank_gen(time, array_index){

    var csv_array = new Array();
    var csv_array_former = new Array();

    for(var i=1; i <= NumberOfMoveImg; i++){
        csv_array.push(parseInt(Data[i][time]));
    }
    for(var i=1; i <= NumberOfMoveImg; i++){
        csv_array_former.push(parseInt(Data[i][time-1]));
    }

    var reference_value = csv_array[array_index];
    var sort_array = csv_array.slice().sort(compareFunc);

     //重複するデータを抽出
     //それに一致するデータは２つの可能性を提示　位置が近い方を採用
    function multi_indexOf(array, index){
        var count = new Array();
        for(var i=0; i< array.length; i++){
            if(index == array[i]){
                count.push(i);
            }
        }
        return(count);
     }

     var rank  = multi_indexOf(sort_array, reference_value);
     var result;
     if(rank.length >= 2){
         same_rank_csv_index  = multi_indexOf(csv_array, reference_value);
         tuned_index = multi_indexOf(same_rank_csv_index, array_index);
         result = rank[tuned_index];
     }else{
         result = rank;
     }

    function compareFunc(a, b) {
        return a - b;
    }
       return(result);
}

function disabledButtons( $disabled ) {
    $buttons = document.getElementById( "sampleButtons" ).getElementsByTagName( "button" );
    for( var $i = 0; $i < $buttons.length; $i++ ) {
        $buttons[$i].disabled = $disabled;
    }
}