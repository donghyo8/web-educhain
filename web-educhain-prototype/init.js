'use strict';
var log4js = require('log4js');
var logger = log4js.getLogger('SampleWebApp');
var jwt = require('jsonwebtoken');
var hfc = require('fabric-client');
var helper = require('./app/helper.js');
var createChannel = require('./app/create-channel.js');
var join = require('./app/join-channel.js');
var install = require('./app/install-chaincode.js');
var instantiate = require('./app/instantiate-chaincode.js');
var invoke = require('./app/invoke-transaction.js');
var query = require('./app/query.js');
var updateAnchorPeers = require('./app/update-anchor-peers.js');
var dna = require('./config/info1');
var rna = require('./config/info2');
var info3 = require('./config/info3');
var info4 = require('./config/info4');
var info5 = require('./config/info5');
require('./config.js');


// 네트워크 초기화 (default)
networkInit();
async function networkInit() {

	// 등록
	var username1 = dna.username;
	var orgname1 = dna.orgname;
	var username2 = rna.username;
	var orgname2 = rna.orgname;
	var username3 = info3.username;
	var orgname3 = info3.orgname;
	var username4 = info4.username;
	var orgname4 = info4.orgname;
	var username5 = info5.username;
	var orgname5 = info5.orgname;

	await helper.getRegisteredUser(username1, orgname1, true);
	logger.debug('Successfully registered the username %s for organization %s', username1, orgname1);
	await helper.getRegisteredUser(username2, orgname2, true);
	logger.debug('Successfully registered the username %s for organization %s', username2, orgname2);
	await helper.getRegisteredUser(username3, orgname3, true);
	logger.debug('Successfully registered the username %s for organization %s', username3, orgname3);
	await helper.getRegisteredUser(username4, orgname4, true);
	logger.debug('Successfully registered the username %s for organization %s', username4, orgname4);
	await helper.getRegisteredUser(username5, orgname5, true);
	logger.debug('Successfully registered the username %s for organization %s', username5, orgname5);


	// 채널 생성 (default)
	logger.info('<<<<<<<<<<<<<<<<< C R E A T E  C H A N N E L >>>>>>>>>>>>>>>>>');
	var channelName = dna.channelName;
	var channelConfigPath = "../artifacts/channel/dk-educhain.tx";
	logger.debug('Channel name : ' + channelName);
	logger.debug('channelConfigPath : ' + channelConfigPath);
	await createChannel.createChannel(channelName, channelConfigPath, username1, orgname1);

	// 채널 조인 (default)
	logger.info('<<<<<<<<<<<<<<<<< J O I N  C H A N N E L >>>>>>>>>>>>>>>>>');
	logger.debug('channelName : ' + channelName);
	logger.debug('peers : ' + [dna.peer]);
	logger.debug('username :' + username1);
	logger.debug('orgname:' + orgname1);
	await join.joinChannel(channelName, [dna.peer], username1, orgname1);

	logger.debug('peers : ' + [rna.peer]);
	logger.debug('username :' + username2);
	logger.debug('orgname:' + orgname2);
	await join.joinChannel(channelName, [rna.peer], username2, orgname2);

	logger.debug('peers : ' + [info3.peer]);
	logger.debug('username :' + username3);
	logger.debug('orgname:' + orgname3);
	await join.joinChannel(channelName, [info3.peer], username3, orgname3);

	logger.debug('peers : ' + [info4.peer]);
	logger.debug('username :' + username4);
	logger.debug('orgname:' + orgname4);
	await join.joinChannel(channelName, [info4.peer], username4, orgname4);

	logger.debug('peers : ' + [info5.peer]);
	logger.debug('username :' + username5);
	logger.debug('orgname:' + orgname5);
	await join.joinChannel(channelName, [info5.peer], username5, orgname5);

	
	// 앵커피어 업데이트
	logger.debug('==================== UPDATE ANCHOR PEERS ==================');
	var configUpdatePath = "../artifacts/channel/Org1MSPanchors.tx";
	var configUpdatePath2 = "../artifacts/channel/Org2MSPanchors.tx";
	var configUpdatePath3 = "../artifacts/channel/Org3MSPanchors.tx";
	var configUpdatePath4 = "../artifacts/channel/Org4MSPanchors.tx";
	var configUpdatePath5 = "../artifacts/channel/Org5MSPanchors.tx";

	logger.debug('Channel name : ' + channelName);
	logger.debug('configUpdatePath : ' + configUpdatePath);
	logger.debug('Channel name : ' + channelName);
	logger.debug('configUpdatePath : ' + configUpdatePath2);
	logger.debug('Channel name : ' + channelName);
	logger.debug('configUpdatePath : ' + configUpdatePath3);
	logger.debug('Channel name : ' + channelName);
	logger.debug('configUpdatePath : ' + configUpdatePath4);
	logger.debug('Channel name : ' + channelName);
	logger.debug('configUpdatePath : ' + configUpdatePath5);

	await updateAnchorPeers.updateAnchorPeers(channelName, configUpdatePath, username1, orgname1);
	await updateAnchorPeers.updateAnchorPeers(channelName, configUpdatePath2, username2, orgname2);
	await updateAnchorPeers.updateAnchorPeers(channelName, configUpdatePath3, username3, orgname3);
	await updateAnchorPeers.updateAnchorPeers(channelName, configUpdatePath4, username4, orgname4);
	await updateAnchorPeers.updateAnchorPeers(channelName, configUpdatePath5, username5, orgname5);
	

	// 타겟 피어 체인코드 설치 (test)
	logger.debug('==================== INSTALL CHAINCODE ==================');
	var chaincodeName = dna.chaincodeName;
	var chaincodePath = "github.com/example_cc/go";
	var chaincodeVersion = 'v0';
	var chaincodeType = 'golang';

	logger.debug('peers : ' + [dna.peer]); // target peers list
	logger.debug('chaincodeName : ' + chaincodeName);
	logger.debug('chaincodePath  : ' + chaincodePath);
	logger.debug('chaincodeVersion  : ' + chaincodeVersion);
	logger.debug('chaincodeType  : ' + chaincodeType);

	await install.installChaincode([dna.peer], chaincodeName, chaincodePath, chaincodeVersion, chaincodeType, username1, orgname1)

	logger.debug('peers : ' + [rna.peer]);
	logger.debug('chaincodeName : ' + chaincodeName);
	logger.debug('chaincodePath  : ' + chaincodePath);
	logger.debug('chaincodeVersion  : ' + chaincodeVersion);
	logger.debug('chaincodeType  : ' + chaincodeType);

	await install.installChaincode([rna.peer], chaincodeName, chaincodePath, chaincodeVersion, chaincodeType, username2, orgname2)

	logger.debug('peers : ' + [info3.peer]);
	logger.debug('chaincodeName : ' + chaincodeName);
	logger.debug('chaincodePath  : ' + chaincodePath);
	logger.debug('chaincodeVersion  : ' + chaincodeVersion);
	logger.debug('chaincodeType  : ' + chaincodeType);

	await install.installChaincode([info3.peer], chaincodeName, chaincodePath, chaincodeVersion, chaincodeType, username3, orgname3)

	logger.debug('peers : ' + [info4.peer]);
	logger.debug('chaincodeName : ' + chaincodeName);
	logger.debug('chaincodePath  : ' + chaincodePath);
	logger.debug('chaincodeVersion  : ' + chaincodeVersion);
	logger.debug('chaincodeType  : ' + chaincodeType);

	await install.installChaincode([info4.peer], chaincodeName, chaincodePath, chaincodeVersion, chaincodeType, username4, orgname4)


	logger.debug('peers : ' + [info5.peer]);
	logger.debug('chaincodeName : ' + chaincodeName);
	logger.debug('chaincodePath  : ' + chaincodePath);
	logger.debug('chaincodeVersion  : ' + chaincodeVersion);
	logger.debug('chaincodeType  : ' + chaincodeType);

	await install.installChaincode([info5.peer], chaincodeName, chaincodePath, chaincodeVersion, chaincodeType, username5, orgname5)

	// 타겟 피어 체인코드 초기화 (test)
	logger.debug('==================== INSTANTIATE CHAINCODE ==================');
	//var fcn = req.body.fcn;
	var peers = ["peer0.org1.example.com", "peer0.org2.example.com", "peer0.org3.example.com", "peer0.org4.example.com", "peer0.org5.example.com", ];
	var args = ["Learner1", "DonghyoKim", "donghyo@dongguk.edu", "C Language", "B+"];
	var fcn = 'init';
	logger.debug('peers  : ' + peers);
	logger.debug('channelName  : ' + channelName);
	logger.debug('chaincodeName : ' + chaincodeName);
	logger.debug('chaincodeVersion  : ' + chaincodeVersion);
	logger.debug('chaincodeType  : ' + chaincodeType);
	logger.debug('args  : ' + args);

	await instantiate.instantiateChaincode(peers, channelName, chaincodeName, chaincodeVersion, fcn, chaincodeType, args, username1, orgname1);

	logger.debug('==================== FINISH INIT BLOCKCHAIN NETWORK ==================');
}


///////////////////////////////////////////////////////////////////////////////
///////////////////////// REST ENDPOINTS START HERE ///////////////////////////
///////////////////////////////////////////////////////////////////////////////

var express = require('express');
var app = express();

// 사용자 등록
app.post('/users', async function (req, res) {
	var username = req.body.username;
	var orgName = req.body.orgName;
	logger.debug('End point : /users');
	logger.debug('User name : ' + username);
	logger.debug('Org name  : ' + orgName);
	if (!username) {
		res.json(getErrorMessage('\'username\''));
		return;
	}
	if (!orgName) {
		res.json(getErrorMessage('\'orgName\''));
		return;
	}
	var token = jwt.sign({
		exp: Math.floor(Date.now() / 1000) + parseInt(hfc.getConfigSetting('jwt_expiretime')),
		username: username,
		orgName: orgName
	}, app.get('secret'));
	let response = await helper.getRegisteredUser(username, orgName, true);
	logger.debug('-- returned from registering the username %s for organization %s', username, orgName);
	if (response && typeof response !== 'string') {
		logger.debug('Successfully registered the username %s for organization %s', username, orgName);
		response.token = token;
		res.json(response);
	} else {
		logger.debug('Failed to register the username %s for organization %s with::%s', username, orgName, response);
		res.json({ success: false, message: response });
	}

});

// 채널 생성
app.post('/channels', async function (req, res) {
	logger.info('============== C R E A T E  C H A N N E L ==============');
	logger.debug('End point : /channels');
	var channelName = req.body.channelName;
	var channelConfigPath = req.body.channelConfigPath;
	logger.debug('Channel name : ' + channelName);
	logger.debug('channelConfigPath : ' + channelConfigPath);

	//../artifacts/channel/dk-educhain.tx

	if (!channelName) {
		res.json(getErrorMessage('\'channelName\''));
		return;
	}
	if (!channelConfigPath) {
		res.json(getErrorMessage('\'channelConfigPath\''));
		return;
	}

	let message = await createChannel.createChannel(channelName, channelConfigPath, req.username, req.orgname);
	res.send(message);
});


// 채널 조인
app.post('/channels/:channelName/peers', async function (req, res) {
	logger.info('============== J O I N  C H A N N E L ==============');
	var channelName = req.params.channelName;
	var peers = req.body.peers;
	logger.debug('channelName : ' + channelName);
	logger.debug('peers : ' + peers);
	logger.debug('username :' + req.username);
	logger.debug('orgname:' + req.orgname);

	if (!channelName) {
		res.json(getErrorMessage('\'channelName\''));
		return;
	}
	if (!peers || peers.length == 0) {
		res.json(getErrorMessage('\'peers\''));
		return;
	}

	let message = await join.joinChannel(channelName, peers, req.username, req.orgname);
	res.send(message);
});


// 앵커피어 업데이트
app.post('/channels/:channelName/anchorpeers', async function(req, res) {
	logger.debug('==================== UPDATE ANCHOR PEERS ==================');
	var channelName = req.params.channelName;
	var configUpdatePath = req.body.configUpdatePath;
	logger.debug('Channel name : ' + channelName);
	logger.debug('configUpdatePath : ' + configUpdatePath);
	if (!channelName) {
		res.json(getErrorMessage('\'channelName\''));
		return;
	}
	if (!configUpdatePath) {
		res.json(getErrorMessage('\'configUpdatePath\''));
		return;
	}

	let message = await updateAnchorPeers.updateAnchorPeers(channelName, configUpdatePath, req.username, req.orgname);
	res.send(message);
});


// 체인코드 설치
app.post('/chaincodes', async function (req, res) {
	logger.debug('==================== INSTALL CHAINCODE ==================');
	var peers = req.body.peers;
	var chaincodeName = req.body.chaincodeName;
	var chaincodePath = req.body.chaincodePath;
	var chaincodeVersion = req.body.chaincodeVersion;
	var chaincodeType = req.body.chaincodeType;

	logger.debug('peers : ' + peers); // target peers list
	logger.debug('chaincodeName : ' + chaincodeName);
	logger.debug('chaincodePath  : ' + chaincodePath);
	logger.debug('chaincodeVersion  : ' + chaincodeVersion);
	logger.debug('chaincodeType  : ' + chaincodeType);
	if (!peers || peers.length == 0) {
		res.json(getErrorMessage('\'peers\''));
		return;
	}
	if (!chaincodeName) {
		res.json(getErrorMessage('\'chaincodeName\''));
		return;
	}
	if (!chaincodePath) {
		res.json(getErrorMessage('\'chaincodePath\''));
		return;
	}
	if (!chaincodeVersion) {
		res.json(getErrorMessage('\'chaincodeVersion\''));
		return;
	}
	if (!chaincodeType) {
		res.json(getErrorMessage('\'chaincodeType\''));
		return;
	}
	let message = await install.installChaincode(peers, chaincodeName, chaincodePath, chaincodeVersion, chaincodeType, req.username, req.orgname)
	res.send(message);
});


// 체인코드 초기화
app.post('/channels/:channelName/chaincodes', async function (req, res) {
	logger.debug('==================== INSTANTIATE CHAINCODE ==================');
	var peers = req.body.peers;
	var chaincodeName = req.body.chaincodeName;
	var chaincodeVersion = req.body.chaincodeVersion;
	var channelName = req.params.channelName;
	var chaincodeType = req.body.chaincodeType;
	var fcn = req.body.fcn;
	var args = req.body.args;
	logger.debug('peers  : ' + peers);
	logger.debug('channelName  : ' + channelName);
	logger.debug('chaincodeName : ' + chaincodeName);
	logger.debug('chaincodeVersion  : ' + chaincodeVersion);
	logger.debug('chaincodeType  : ' + chaincodeType);
	logger.debug('fcn  : ' + fcn);
	logger.debug('args  : ' + args);
	if (!chaincodeName) {
		res.json(getErrorMessage('\'chaincodeName\''));
		return;
	}
	if (!chaincodeVersion) {
		res.json(getErrorMessage('\'chaincodeVersion\''));
		return;
	}
	if (!channelName) {
		res.json(getErrorMessage('\'channelName\''));
		return;
	}
	if (!chaincodeType) {
		res.json(getErrorMessage('\'chaincodeType\''));
		return;
	}
	if (!args) {
		res.json(getErrorMessage('\'args\''));
		return;
	}

	let message = await instantiate.instantiateChaincode(peers, channelName, chaincodeName, chaincodeVersion, chaincodeType, fcn, args, req.username, req.orgname);
	res.send(message);
});


// 체인코드 Invoke
app.post('/channels/:channelName/chaincodes/:chaincodeName', async function (req, res) {
	logger.debug('==================== INVOKE ON CHAINCODE ==================');
	var peers = req.body.peers;
	var chaincodeName = req.params.chaincodeName;
	var channelName = req.params.channelName;
	var fcn = req.body.fcn;
	var args = req.body.args;
	logger.debug('channelName  : ' + channelName);
	logger.debug('chaincodeName : ' + chaincodeName);
	logger.debug('fcn  : ' + fcn);
	logger.debug('args  : ' + args);
	if (!chaincodeName) {
		res.json(getErrorMessage('\'chaincodeName\''));
		return;
	}
	if (!channelName) {
		res.json(getErrorMessage('\'channelName\''));
		return;
	}
	if (!fcn) {
		res.json(getErrorMessage('\'fcn\''));
		return;
	}
	if (!args) {
		res.json(getErrorMessage('\'args\''));
		return;
	}

	let message = await invoke.invokeChaincode(peers, channelName, chaincodeName, fcn, args, req.username, req.orgname);
	res.send(message);
});


// 체인코드 Query
app.get('/channels/:channelName/chaincodes/:chaincodeName', async function (req, res) {
	logger.debug('==================== QUERY BY CHAINCODE ==================');
	var channelName = req.params.channelName;
	var chaincodeName = req.params.chaincodeName;
	let args = req.query.args;
	let fcn = req.query.fcn;
	let peer = req.query.peer;

	logger.debug('channelName : ' + channelName);
	logger.debug('chaincodeName : ' + chaincodeName);
	logger.debug('fcn : ' + fcn);
	logger.debug('args : ' + args);

	if (!chaincodeName) {
		res.json(getErrorMessage('\'chaincodeName\''));
		return;
	}
	if (!channelName) {
		res.json(getErrorMessage('\'channelName\''));
		return;
	}
	if (!fcn) {
		res.json(getErrorMessage('\'fcn\''));
		return;
	}
	if (!args) {
		res.json(getErrorMessage('\'args\''));
		return;
	}
	args = args.replace(/'/g, '"');
	args = JSON.parse(args);
	logger.debug(args);

	let message = await query.queryChaincode(peer, channelName, chaincodeName, args, fcn, req.username, req.orgname);
	res.send(message);
});


//  블록정보 조회
app.get('/channels/:channelName/blocks/:blockId', async function (req, res) {
	logger.debug('==================== GET BLOCK BY NUMBER ==================');
	let blockId = req.params.blockId;
	let peer = req.query.peer;
	logger.debug('channelName : ' + req.params.channelName);
	logger.debug('BlockID : ' + blockId);
	logger.debug('Peer : ' + peer);
	if (!blockId) {
		res.json(getErrorMessage('\'blockId\''));
		return;
	}

	let message = await query.getBlockByNumber(peer, req.params.channelName, blockId, req.username, req.orgname);
	res.send(message);
});


// 트랜잭션 ID 조회
app.get('/channels/:channelName/transactions/:trxnId', async function (req, res) {
	logger.debug('================ GET TRANSACTION BY TRANSACTION_ID ======================');
	logger.debug('channelName : ' + req.params.channelName);
	let trxnId = req.params.trxnId;
	let peer = req.query.peer;
	if (!trxnId) {
		res.json(getErrorMessage('\'trxnId\''));
		return;
	}

	let message = await query.getTransactionByID(peer, req.params.channelName, trxnId, req.username, req.orgname);
	res.send(message);
});


// 블록 해쉬값 조회
app.get('/channels/:channelName/blocks', async function (req, res) {
	logger.debug('================ GET BLOCK BY HASH ======================');
	logger.debug('channelName : ' + req.params.channelName);
	let hash = req.query.hash;
	let peer = req.query.peer;
	if (!hash) {
		res.json(getErrorMessage('\'hash\''));
		return;
	}

	let message = await query.getBlockByHash(peer, req.params.channelName, hash, req.username, req.orgname);
	res.send(message);
});


// 채널정보 조회
app.get('/channels/:channelName', async function (req, res) {
	logger.debug('================ GET CHANNEL INFORMATION ======================');
	logger.debug('channelName : ' + req.params.channelName);
	let peer = req.query.peer;

	let message = await query.getChainInfo(peer, req.params.channelName, req.username, req.orgname);
	res.send(message);
});


// 채널 초기화 정보 조회
app.get('/channels/:channelName/chaincodes', async function (req, res) {
	logger.debug('================ GET INSTANTIATED CHAINCODES ======================');
	logger.debug('channelName : ' + req.params.channelName);
	let peer = req.query.peer;

	let message = await query.getInstalledChaincodes(peer, req.params.channelName, 'instantiated', req.username, req.orgname);
	res.send(message);
});


// 모든 설치된 체인코드 및 초기화 정보 조회
app.get('/chaincodes', async function (req, res) {
	var peer = req.query.peer;
	var installType = req.query.type;
	logger.debug('================ GET INSTALLED CHAINCODES ======================');

	let message = await query.getInstalledChaincodes(peer, null, 'installed', req.username, req.orgname)
	res.send(message);
});


// 채널 업데이트 정보 조회
app.get('/channels', async function (req, res) {
	logger.debug('================ GET CHANNELS ======================');
	logger.debug('peer: ' + req.query.peer);
	var peer = req.query.peer;
	if (!peer) {
		res.json(getErrorMessage('\'peer\''));
		return;
	}

	let message = await query.getChannels(peer, req.username, req.orgname);
	res.send(message);
});

function getErrorMessage(field) {
	var response = {
		success: false,
		message: field + ' field is missing or Invalid in the request'
	};
	return response;
}