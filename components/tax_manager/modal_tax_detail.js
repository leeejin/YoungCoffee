import React, { Component } from "react";
import { Button, Modal, CloseButton,Table, } from "react-bootstrap";

import Constant from "../../util/constant_variables";
import WebServiceManager from "../../util/webservice_manager";


//taxinfo 상세보기 모달 클래스
export default class ModalTaxDetail extends Component {
    constructor(props) {
        super(props);
        //this.id = this.props.item.id
        this.state = {
            // companyNoImageURI: '', //companyNoImageURI:사업자등록증 사진
            // cardImageURI: '' //cardImageURI:명함 사진
        }
    }

    downloadExcelButtonClicked = () => {
        if (window.confirm("다운로드하시겠습니까?")) {
            if (this.props.item.complete == 1) {
                const element = document.createElement('a');
                const url = Constant.serviceURL + "/admin/GetSettledExcel?user_id=" + this.props.item.userID + "&day=" + this.props.item.belongDate;
                //console.log('excel down url = ', url);
                element.href = url;
                document.body.appendChild(element);
                element.click();
                this.props.closeButtonListener();
            }
        }
    }


    cancelCompleteButtonClicked=()=> {
        if(window.confirm(this.props.item.cmpName+"의 "+this.props.item.belongDate+"월분 \n정산을 보류 하시겠습니까?")) {
            this.callSetCancelCompleteAPI().then((response)=> {
                if(response.success>0) {
                    alert(this.props.item.cmpName+"의 "+this.props.item.belongDate+"월분 \n정산이 보류되었습니다");
                    this.props.onRefresh();
                }
                else
                    alert(this.props.item.cmpName+"의 "+this.props.item.belongDate+"월분 \n정산보류에 실패하였습니다");
                this.props.closeButtonListener();
            });
        }
    }

    async callSetCancelCompleteAPI() {
        const login = { "userID": parseInt(sessionStorage.getItem("userID")), "passwd":sessionStorage.getItem("passwd") }
        const data = {
            userID: this.props.item.userID,
            day: this.props.item.belongDate
        };

        let manager = new WebServiceManager(Constant.serviceURL + "/admin/SetCancelComplete", "post");
        manager.addFormData("login", login); //마감취소할 권한이 있는지 확인
        manager.addFormData("data", data); //넣을 데이터

        let response = await manager.start();
        if (response.ok)
            return response.json();
    }


    render() {
        const item = this.props.item;
        return (
            <div className="modal w-100 h-100" >

                <Modal.Dialog
                    size="lg"
                    centered>
                    <Modal.Header>
                        <Modal.Title>상세보기</Modal.Title>
                        <CloseButton onClick={this.props.closeButtonListener} />
                    </Modal.Header>

                    <Modal.Body>
                        <div>
                            <Table bordered className="w-100">
                                <tbody>
                                    <tr>
                                        <th>년-월</th>
                                        <td>{item.belongDate}</td>
                                    </tr>
                                    <tr>
                                        <th>가맹점 명</th>
                                        <td>{item.cmpName}</td>
                                    </tr>
                                    <tr>
                                        <th>전화번호</th>
                                        <td>{item.cmpTel}</td>
                                    </tr>
                                    <tr>
                                        <th>주소</th>
                                        <td>{item.cmpAddress}</td>
                                    </tr>
                                    <tr>
                                        <th >마감여부</th>
                                        {item.complete === 1 ? (<td>O</td>) : (<td>X</td>)}
                                    </tr>
                                    <tr>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        {item.complete === 1 && <Button className="downloadButton" onClick={this.cancelCompleteButtonClicked}>정산보류</Button>}
                        {item.complete === 1 && <Button className="downloadButton" onClick={this.downloadExcelButtonClicked}>다운로드</Button>}
                    </Modal.Footer>
                </Modal.Dialog>
            </div>
        )
    }
}