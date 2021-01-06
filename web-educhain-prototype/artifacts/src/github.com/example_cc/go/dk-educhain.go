package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"strconv"
	"time"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

var logger = shim.NewLogger("example_cc0")

type SimpleChaincode struct {
}

type doc struct {
	ObjectType     string `json:"docType"`
	Timestamp      string `json:"timestamp"`
	TxID           string `json:"txID"`
	Details        string `json:"details"`
	MemberID       string `json:"memberID"`
	MemberName     string `json:"memberName"`
	MemberRNN      string `json:"memberRNN"`
	EvaluationID   string `json:"evaluationID"`
	EvaluationName string `json:"evaluationName"`
	EvaluationRNN  string `json:"evaluationRNN"`
	Subject        string `json:"subject"`
	Grade          string `json:"grade"`
}

// 이름, 아이디, 이메일 추가
func (t *SimpleChaincode) Init(stub shim.ChaincodeStubInterface) pb.Response {
	logger.Info("########### Educhain Init ###########")

	_, args := stub.GetFunctionAndParameters()
	var name, id, email, subject, Grade string
	var eduId, date string //학습데이터 식별값
	var eduData string     //이름, 아이디, 이메일
	var err error

	// 스크립트의 arguments로 입력받는 매개변수 5개
	if len(args) != 5 {
		return shim.Error("Incorrect number of arguments. Expecting 5")
	}

	// 데이터 저장
	id = args[0]
	name = args[1]
	email = args[2]
	subject = args[3]
	Grade = args[4]
	eduId = id //학습데이터는 id로 식별

	// 현재 Init date의 날짜 및 시간 초기화
	now := time.Now()
	convH, _ := time.ParseDuration("9h")
	date = now.Add(+convH).Format("2006-01-02 15:04:05")

	fmt.Printf("Date : %s, EduId : %s, Id : %s, Name : %s, Email : %s, subject : %s, Grade : %s\n", date, eduId, id, name, email, subject, Grade)

	eduData = "\n" + "Update Date : " + date + "\n" + "Id : " + id + "\n" + "Name : " + name + "\n" + "Email : " + email + "\n" + "Subject : " + subject + "\n" + "Grade : " + Grade

	// 문자열로 원장에 저장하기
	err = stub.PutState(eduId, []byte(eduData))
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}

func (t *SimpleChaincode) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	logger.Info("########### Educhain Invoke ###########")

	function, args := stub.GetFunctionAndParameters()

	if function == "delete" { // o
		// Deletes an entity from its state
		return t.delete(stub, args)
	}

	if function == "query" { // o
		// queries an entity state
		return t.query(stub, args)
	}
	if function == "invoke" { // o
		// Deletes an entity from its state
		return t.invoke(stub, args)
	}
	if function == "tx_state" {
		// Update transaction state
		return t.tx_state(stub, args)
	}
	if function == "report" {
		// Report the transaction
		return t.report(stub, args)
	}
	if function == "history" {
		// Report the transaction
		return t.history(stub, args)
	}
	if function == "queryBySeller" {
		// queries an entity state
		return t.queryBySeller(stub, args)
	}
	if function == "queryByBuyer" {
		// queries an entity state
		return t.queryByBuyer(stub, args)
	}

	return shim.Error("Invalid invoke function name. Expecting \"invoke\" \"delete\" \"query\"")
}

// 과목 정보 추가 및 업데이트
func (t *SimpleChaincode) invoke(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var eduId string                           // 학습 아이디
	var subjectName, subjectGrade, date string // 과목 이름, 과목 등급
	var err error

	// 매개 변수 3개
	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}

	// 스크립트의 arguments로 입력받는 매개변수 3개
	eduId = args[0]
	subjectName = args[1]
	subjectGrade = args[2]

	// 학습 데이터 가져오기
	valbytes, err := stub.GetState(eduId)
	if err != nil {
		return shim.Error("Failed to get state")
	}

	// 원장에서 데이터를 읽어와서 날짜 및 시간 업데이트
	now := time.Now()
	convH, _ := time.ParseDuration("9h")
	date = now.Add(+convH).Format("2006-01-02 15:04:05")

	fmt.Printf(date)

	stringData := string(valbytes)
	stringData = "\n" + "Update Date : " + date + stringData[34:len(stringData)]
	stringData += "\n" + "Subject : " + subjectName + "\n" + "Grade : " + subjectGrade

	// 학습 데이터 원장에 저장
	err = stub.PutState(eduId, []byte(stringData))
	if err != nil {
		return shim.Error("Failed to put state")
	}
	return shim.Success(nil)
}

// 원장에서 삭제
func (t *SimpleChaincode) delete(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	// 스크립트의 arguments로 입력받는 매개변수 1개
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	eduId := args[0]

	err := stub.DelState(eduId)
	if err != nil {
		return shim.Error("Failed to delete state")
	}

	return shim.Success(nil)
}

// 학습데이터 조회
func (t *SimpleChaincode) query(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var A, date string // Entities
	var err error

	now := time.Now()
	convH, _ := time.ParseDuration("9h")
	date = now.Add(+convH).Format("2006-01-02 15:04:05")

	// 스크립트의 arguments로 입력받는 매개변수 1개
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting name of the person to query")
	}

	A = args[0]

	//원장에서 상태 조회
	Avalbytes, err := stub.GetState(A)
	if err != nil {
		jsonResp := "{\"Error\":\"Failed to get state for " + A + "\"}"
		return shim.Error(jsonResp)
	}

	if Avalbytes == nil {
		jsonResp := "{\"Error\":\"Nil amount for " + A + "\"}"
		return shim.Error(jsonResp)

	}

	jsonResp := "\n" + "{\"EduId\":\"" + A + "\"\n\"Learning History Data\":\"" + string(Avalbytes) + "\"}"
	fmt.Printf("[Query Date] : %s\n[Query Result] : %s\n", date, jsonResp)
	return shim.Success(Avalbytes)

}

func (t *SimpleChaincode) tx_state(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	var err error

	//	  0	      1        2		  3 		 4         5         6	        7		 8	     9	   10
	//	txID  txState  member_ID  member_Name  member_RNN  evaluation_ID  evaluatio_Name  evaluatio_RNN  subject  grade  web

	if len(args) != 11 {
		return shim.Error("Incorrect number of arguments. Expecting name of the person to query")
	}

	now := time.Now()
	convH, _ := time.ParseDuration("9h")
	timestamp := now.Add(+convH).Format("2006-01-02 15:04:05")

	txID := args[0]
	txState := args[1]
	memberID := args[2]
	memberName := args[3]
	memberRNN := args[4]
	evaluationID := args[5]
	evaluationName := args[6]
	evaluationRNN := args[7]
	subject := args[8]
	grade := args[9]
	web := args[10]
	objectType := "transaction"

	// objectType(doctype),  details--> ex.) match, timestamp, txID

	tx := &doc{objectType, timestamp, txID, txState, memberID, memberName, memberRNN, evaluationID, evaluationName, evaluationRNN, subject, grade}

	txJSONasBytes, err := json.Marshal(tx) // JSON으로 변환

	if err != nil {
		return shim.Error(err.Error())
	}
	// Write the state to the ledger
	err = stub.PutState(web+"_"+txID+"_"+txState, txJSONasBytes)

	if err != nil {
		return shim.Error(err.Error())
	}

	logger.Info("Transaction ID = " + txID + ", Transaction State = " + txState + "\n")

	return shim.Success(nil)
}

// Report  the transaction
func (t *SimpleChaincode) report(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	var err error

	//	  0	     1   	   2		 3 	   	     4        5          6	        7        8	     9     10
	//	txID  details  memberID  memberName  memberRNN  evaluationID  evaluatioName  evaluatioRNN  subject  grade  web
	if len(args) != 11 {
		return shim.Error("Incorrect number of arguments. Expecting name of the person to query")
	}

	now := time.Now()
	convH, _ := time.ParseDuration("9h")
	timestamp := now.Add(+convH).Format("2006-01-02 15:04:05")

	txID := args[0]
	details := args[1]
	memberID := args[2]
	memberName := args[3]
	memberRNN := args[4]
	// if err != nil {
	// 	return shim.Error("6th argument must be a numeric string")
	// }
	evaluationID := args[5]
	evaluationName := args[6]
	evaluationRNN := args[7]
	// if err != nil {
	// 	return shim.Error("9th argument must be a numeric string")
	// }
	subject := args[8]
	grade := args[9]
	web := args[10]

	objectType := "report"
	rp := &doc{objectType, timestamp, txID, details, memberID, memberName, memberRNN, evaluationID, evaluationName, evaluationRNN, subject, grade}

	rpJSONasBytes, err := json.Marshal(rp)

	if err != nil {
		return shim.Error(err.Error())
	}

	// Write the state to the ledger
	err = stub.PutState(web+"_"+txID+"_report", rpJSONasBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	logger.Info("Report Successful! , Transaction ID = " + txID + "\n")

	return shim.Success(nil)
}

func (t *SimpleChaincode) history(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	//       0
	//	txID or reportID
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	keyID := args[0]

	fmt.Printf("- start getHistoryForMarble: %s\n", keyID)

	resultsIterator, err := stub.GetHistoryForKey(keyID)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing historic values for the marble
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false

	for resultsIterator.HasNext() {
		response, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"TxId\":")
		buffer.WriteString("\"")
		buffer.WriteString(response.TxId)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Value\":")
		// if it was a delete operation on given key, then we need to set the
		//corresponding value null. Else, we will write the response.Value
		//as-is (as the Value itself a JSON marble)
		if response.IsDelete {
			buffer.WriteString("null")
		} else {
			buffer.WriteString(string(response.Value))
		}

		buffer.WriteString(", \"Timestamp\":")
		buffer.WriteString("\"")
		buffer.WriteString(time.Unix(response.Timestamp.Seconds, int64(response.Timestamp.Nanos)).String())
		buffer.WriteString("\"")

		buffer.WriteString(", \"IsDelete\":")
		buffer.WriteString("\"")
		buffer.WriteString(strconv.FormatBool(response.IsDelete))
		buffer.WriteString("\"")

		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- getHistoryForMarble returning:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}

func (t *SimpleChaincode) queryBySeller(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	//		0
	//	memberRNN
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	memberRNN := args[0]

	queryString := fmt.Sprintf("{\"selector\":{\"memberRNN\":\"%s\"}}", memberRNN)

	queryResults, err := getQueryResultForQueryString(stub, queryString)

	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(queryResults)
}

func (t *SimpleChaincode) queryByBuyer(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	//		0
	//	evluationRNN
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	evaluationRNN := args[0]

	queryString := fmt.Sprintf("{\"selector\":{\"evaluationRNN\":\"%s\"}}", evaluationRNN)

	queryResults, err := getQueryResultForQueryString(stub, queryString)

	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(queryResults)
}

// =========================================================================================
// getQueryResultForQueryString: 전달된 쿼리 문자열을 실행(Json Result를 포함하는 바이트 배열로 반환)
// =========================================================================================

func getQueryResultForQueryString(stub shim.ChaincodeStubInterface, queryString string) ([]byte, error) {

	fmt.Printf("- getQueryResultForQueryString queryString:\n%s\n", queryString)

	resultsIterator, err := stub.GetQueryResult(queryString)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	buffer, err := constructQueryResponseFromIterator(resultsIterator)
	if err != nil {
		return nil, err
	}

	fmt.Printf("- getQueryResultForQueryString queryResult:\n%s\n", buffer.String())

	return buffer.Bytes(), nil
}

// =========================================================================================
// constructQueryResponseFromIterator: 쿼리 결과를 포함하는 Json 배열 생성
// =========================================================================================

func constructQueryResponseFromIterator(resultsIterator shim.StateQueryIteratorInterface) (*bytes.Buffer, error) {
	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer

	bArrayMemberAlreadyWritten := false

	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString("&&")
		}
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		bArrayMemberAlreadyWritten = true
	}

	return &buffer, nil
}

func main() {
	err := shim.Start(new(SimpleChaincode))
	if err != nil {
		fmt.Printf("Error starting Simple chaincode: %s", err)
	}
}
