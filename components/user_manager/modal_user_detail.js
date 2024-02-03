import React, { Component } from "react";
import { Button, Modal, CloseButton,Table,  } from "react-bootstrap";

import WebServiceManager from "../../util/webservice_manager";
import Constant from "../../util/constant_variables";


//UserInfo 상세보기 모달 클래스
export default class UserDetailModal extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
          //validate : this.props.item.validate,
        }
    }

    setInitializePasswd=()=> {
        if(window.confirm("가맹점 등록시 사용한 전화번호로 비밀번호를 초기화힙니다.\n 진행하시겠습니까?")) {
            this.callSetInitializePasswdAPI().then((response)=> {
                if(response.success>0)
                    alert(this.props.item.cmpName+"의 비밀번호가 초기화 되었습니다.");
                else
                    alert(this.props.item.cmpName+"의 비밀번호가 초기화에 실패했습니다.");
            });
        }
    }


    async callSetInitializePasswdAPI() {
        const login = { "userID": parseInt(sessionStorage.getItem("userID")), "passwd":sessionStorage.getItem("passwd") }
        const data = {userID: this.props.item.userID};

        let manager = new WebServiceManager(Constant.serviceURL + "/admin/SetInitializePasswd", "post");
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
                                        <th>가맹점 명</th>
                                        <td>{item.cmpName}</td>
                                    </tr>
                                    <tr>
                                        <th >사업자번호</th>
                                        <td>{Constant.transformCmpNo(item.cmpNo)}</td>

                                    </tr>
                                    <tr>
                                        <th>전화번호</th>
                                        <td>{Constant.transformPhoneNumber(item.cmpTel)}</td>
                                    </tr>
                                    <tr>
                                        <th>주소</th>
                                        <td>{item.cmpAddress}</td>
                                    </tr>
                                    <tr>
                                        <th>대표자이름</th>
                                        <td>{item.repName}</td>
                                    </tr>
                                    <tr>
                                        <th>사용여부</th>
                                        {item.validate === 1 ? (<td>O</td>) : (<td>X</td>)}
                                    </tr>

                                </tbody>

                            </Table>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        {<Button className="downloadButton" onClick={this.setInitializePasswd}>비밀번호 초기화</Button>}
                        {/*
                        {
                            item.validate === 1 ? <Button variant="danger" onClick={() => { this.props.disabledButtonClicked() }}>비활성화</Button>
                                : <Button variant="primary" onClick={() => { this.props.abledButtonClicked() }}>활성화</Button>
                        }
                    */}


                    </Modal.Footer>
                </Modal.Dialog>


            </div>
        )
    }
}