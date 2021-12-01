//유저이름 가져오기
let user = localStorage.getItem("username")
$("#username").html(user);


// ajax 시 헤더 부분에 토큰 넣어주고 코드를 줄일 수 있다
$.ajaxPrefilter(function( options, originalOptions, jqXHR ) {
    if(localStorage.getItem('token')) {
        jqXHR.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('token'));
    }
});

// let team = ""

$(document).ready(function () {
    teamCheck();
    $("input[name=checked-team]").val('')
    /*    pieChartDraw();*/
    // $('.progress-value > span').each(function () {
    //     $(this).prop('Counter', 0).animate({
    //         Counter: $(this).text()
    //     }, {
    //         duration: 1500,
    //         easing: 'swing',
    //         step: function (now) {
    //             $(this).text(Math.ceil(now));
    //         }
    //     });
    // });


});

//progress bar
// function get_progressbar() {
//     $.ajax({
//         type: "POST",
//         url: "/get-progressbar",
//         data: {},
//         success: function (response) {
//             let percent = response['percent']
//             let done_count = response['done_count']
//
//             $('.progress-value').css('font-size', `25px`);
//             $('.progress-value').css('line-height', `44px`);
//             $('.progress-value').append(`${percent}%`)
//
//             $('#percent-bar').css('width', `${percent}%`);
//             $('#percent-bar').css('font-size', `18px`);
//             $('#percent-bar').append(`${done_count}개`)
//         }
//     })
// }

// 팀 소속 여부 확인
function teamCheck() {
    $.ajax({
        type: "GET",
        url: `/team`,
        success: function (response) {
            if (response == "아직 소속된 팀이 없습니다.") {
                $('.team-exist').hide()
                let temp_html = `<h1>아직 소속된 팀이 없습니다.</h1>`
                $('#team-alert').append(temp_html)
            } else {
                $('.not-exist').hide()
                let team = `${response}`
                $('#team').css('color', `whitesmoke`);
                $('#team').css('font-size', `40px`);
                $('#team').append(team)
                checkstatus();
                showtask()
            }
        }
    })
}

function hide_teamname() {
    $("#can-using").hide()
    $("#cant-using").hide()
    $("#double-check").hide()
}

// 팀 만들기 기능
function createTeam() {
    team = $('#team-name').val()
    let teamname = {teamname : team}
    $.ajax({
        type: "POST",
        url: "/team",
        contentType: "application/json",
        data: JSON.stringify(teamname),
        success: function (response) {
            if (response == '중복된 팀명이 존재합니다.') {
                alert(response);
            } else {
                alert("팀 만들기 성공!");
                $('#create-team-close').click()
                $('.not-exist').hide()
                $('.team-exist').show()
                let team = response
                $('#team').append(team)
                // checkstatus();
            }
        }
    })
        // hidden input의 value로 중복확인 버튼을 눌렀는지 안눌렀는지 확인
    // if ($("input[name=checked-team]").val() != 'y') {
    //     alert("중복확인을 통과한 경우만 만들 수 있습니다.")
    //     $("#team-name").val(null);
    // } else {
    //     $.ajax({
    //         type: "POST",
    //         url: "/team",
    //         contentType: "application/json",
    //         data: JSON.stringify(teamname),
    //         success: function (response) {
    //             if (response["msg"] == '팀 만들기 완료') {
    //                 alert(response["msg"]);
    //                 $('#create-team-close').click()
    //                 $('.not-exist').hide()
    //                 $('.team-exist').show()
    //                 let team = `${team}`
    //                 $('#team').append(team)
    //                 checkstatus();
    //                 show_task(team)
    //             } else {
    //                 alert(response["서버 오류"]);
    //             }
    //         }
    //     })
    // }
}

// function invite_team() {
//     let str_space = /\s/;
//     invite_name = $('#invite-name').val()
//
//     if (!invite_name || str_space.exec(invite_name)) {
//         alert("팀 이름에 공백을 사용할 수 없습니다.")
//         $("#invite-name").val(null);
//     } else {
//         $.ajax({
//             type: "POST",
//             url: "/team",
//             data: {
//                 team: invite_name
//             },
//             success: function (response) {
//                 if (response["msg"] == '초대받은 팀에 가입되었습니다.') {
//                     alert(response["msg"]);
//                     $('#create-team-close').click()
//                     $('.not-exist').hide()
//                     $('.team-exist').show()
//                     let team = `${invite_name}`
//                     $('#team').append(team)
//                     checkstatus();
//                     show_task(team)
//                 } else if (response["msg"] == '존재하지 않는 팀입니다. 팀 이름을 확인해주세요.') {
//                     alert(response["msg"]);
//                 }
//             }
//         })
//     }
// }
//
// // 팀 만들기 시 팀명 중복확인 기능
// function teamname_check() {
//     let str_space = /\s/;
//     team = $('#team-name').val()
//     if (!team || str_space.exec(team)) {
//         alert("팀 이름에 공백을 사용할 수 없습니다.")
//         $("#team-name").val("");
//     } else {
//         $.ajax({
//             type: "POST",
//             url: "/team",
//             headers: {
//                 Authorization: getCookie('access_token')
//             },
//             data: {
//                 team: team
//             },
//             success: function (response) {
//                 if (response['msg'] == "사용할 수 있는 팀 이름입니다.") {
//                     $("#double-check").hide()
//                     $("#cant-using").hide()
//                     $("#can-using").show()
//                     $("input[name=checked-team]").val('y');
//                 } else if (response['msg'] == "중복되는 팀 이름입니다. 다시 입력해주세요.") {
//                     $("#double-check").hide()
//                     $("#can-using").hide()
//                     $("#cant-using").show()
//                     $("input[name=checked-team]").val('');
//                 } else if (response['msg'] == "특수문자를 제외하고 작성해주세요"){
//                     $("#double-check").show()
//                     $("#cant-using").hide()
//                     $("#can-using").hide()
//                     $("input[name=checked-team]").val('');
//                 }
//             }
//         });
//     }
// }
//

/*to do list*/
function showtask() {
    $.ajax({
        type: "GET",
        url: "/team/task",
        success: function (response) {
            // get_progressbar()
            for (let i = 0; i < response.length; i++) {
                let task = response[i]['task']
                let done = response[i]['done']
                let id = response[i]['id']
                makeListTask(task, done, id);
            }
        }
    })
}

// 할일 화면에 띄우기
function makeListTask(task, done, id) {
    //할 일이 아직 완료 상태가 아니면
    if (done == false) {
        let tempHtml = `<div class='task'>${task}<i class='bi bi-trash-fill' onclick="deletetask('${id}')"></i><i class='bi bi-check-lg' onclick="changedone('${id}')"></i></div>`;
        $(".notdone").append(tempHtml);
    } else { //할 일이 완료 상태면
        let tempHtml = `<div class='task'>${task}<i class='bi bi-trash-fill' onclick="deletetask('${id}')"></i><i class='bi bi-check-lg' onclick="changedone('${id}')"></i></div>`;
        $(".done").append(tempHtml);
    }
}

// 내가 속한 팀 찾아 할일 저장하기
$(document).ready(function () {
    $('#taskinput').keydown(function (key) {
       if (key.keyCode == 13) {
           let task = $(".txt").val();
           let teamtask = {task : task}
           $.ajax({
               type: "POST",
               url: "/team/task",
               contentType: "application/json",
               data: JSON.stringify(teamtask),
               success: function (response) {
                   let task = response['task']
                   let id = response['id']
                   let temphtml = `<div class='task'>${task}<i class='bi bi-trash-fill' onclick="deletetask('${id}')"></i><i class='bi bi-check-lg' onclick="changedone('${id}')"></i></div>`
                   $(".notdone").append(temphtml);
               }
           });
           //입력 창 비우기
           $(".txt").val("");
       }
    })
})


// to do list 삭제 버튼
function deletetask(id) {
    let taskId = {id:id}
    $.ajax({
        type: "POST",
        url: `/team/deletetask`,
        contentType: "application/json",
        data: JSON.stringify(taskId),
        success: function () {
            window.location.reload();
        }
    })
}

// 할 일을 완료했는지 안 했는지 상태 변경 및 저장
function changedone(id) {
    let taskId = {id:id}
    $.ajax({
        type: "POST",
        url: `/team/changetask`,
        contentType: "application/json",
        data: JSON.stringify(taskId),
        success: function () {
            window.location.reload();
        }
    })
}

//팀원들의 출결 상태 불러오기
function checkstatus() {
    $.ajax({
        type: "GET",
        url: "/team/status",
        success: function (response) {
            let user_data = response['user_data']
            for (let i = 0; i < user_data.length; i++) {
                let nick_name = user_data[i]['nick_name']
                let status = user_data[i]['status']
                let temphtml = `<tr>
                                <td>${nick_name}</td>
                                <td>${status}</td>
                                </tr>`;
                $("#status-table").append(temphtml);
            }
        }
    });
}

