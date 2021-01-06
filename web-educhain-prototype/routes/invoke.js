var invoke = require('../app/invoke-transaction');
var query = require('../app/query');
var dna = require('../config/info1');

var peer = dna.peer;
var channelName = dna.channelName;
var chaincodeName = dna.chaincodeName;
var username = dna.username;
var orgname = dna.orgname;

// rows == DBInfo
var myinvoke = async function(rows, status){
    try {
        var fcn;
        if(status!='report'){
            fcn = 'report';
        } 
        else fcn = 'tx_state';
        //	  0	      1        2		  3 		  4        5         6	        7		 8	     9	   10
        //	txID  txState  sellerID  sellerName  sellerRRN  buyerID  buyerName  buyerRRN  product  price  web
        var args = [rows[1].Number.toString(), status , rows[1].id, rows[1].Member_name, rows[1].RRN_hash, rows[0].id, rows[0].Member_name, rows[0].RRN_hash, rows[0].Product_name, rows[0].Product_price.toString(), username];
        await invoke.invokeChaincode(peer, channelName, chaincodeName, fcn, args, username, orgname);

        // console.log([rows[1].Number.toString(), status , rows[1].id, rows[1].Member_name, rows[1].RRN_hash, rows[0].id, rows[0].Member_name, rows[0].RRN_hash, rows[0].Product_name, rows[0].Product_price.toString(), username]);

    } catch (err) {
        console.log('invoke error :' + err);
    }
}  


// 평가 : tx_state (match)
// 상태진행: tx_state (shipping)
// 평가완료 : tx_state (finish)

var myinvoke = async function(){
    var rows = arguments[0];
    if(arguments.length == 2){
        try {
            var fcn = 'tx_state';
            var status = arguments[1];

	//	  0	      1        2		  3 		 4         5         6	        7		 8	     9	   10
    //	txID  txState  member_ID  member_Name  member_RNN  evaluation_ID  evaluatio_Name  evaluatio_RNN  subject  grade  web

            // 'product_id'
            // 'status'
            // 'memberID'
            // 'Member_name'
            // 'Evaluation_RRN'
            // 'evaluationID'
            // 'member_RRN'
            // 'subject'
            // 'grade'
            // 'username'

            var args = [rows[1].Number.toString(), status , rows[1].id, rows[1].Member_name, rows[1].RRN_hash, rows[0].id, rows[0].Member_name, rows[0].RRN_hash, rows[0].Product_name, rows[0].Product_price.toString(), username];
            await invoke.invokeChaincode(peer, channelName, chaincodeName, fcn, args, username, orgname);

            
        } catch (err) {
            console.log('invoke error :' + err); 
        }

    } else if(arguments.length == 3){
        try{
            var fcn = 'report';
            var details = arguments[2];

	//	  0	      1        2		  3 		 4         5         6	        7		 8	     9	   10
    //	txID  txState  member_ID  member_Name  member_RNN  evaluation_ID  evaluatio_Name  evaluatio_RNN  subject  grade  web
    
            var args = [rows[1].Number.toString(), details , rows[1].id, rows[1].Member_name, rows[1].RRN_hash, rows[0].id, rows[0].Member_name, rows[0].RRN_hash, rows[0].Product_name, rows[0].Product_price.toString(), username];
            await invoke.invokeChaincode(peer, channelName, chaincodeName, fcn, args, username, orgname);
        } catch (err){
            console.log('invoke error :' + err);
        }
    }
}

module.exports = myinvoke;