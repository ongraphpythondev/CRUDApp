$(document).ready(function(){
  $('#drop_second_first').click(function(){
    $('.drop_down_1').toggleClass('drop-down--active');
  });
});

$(document).ready(function(){
  $('#drop_second').click(function(){
    $('.drop_down_2').toggleClass('drop-down--active');
  });
});


         $(document).ready(function() {
            getList(1)
        } );


        //  $(document).ready(function() {
        //     $('#example').DataTable(
        //     {"bPaginate": false});
        // } );




           $(document).ready(function(){
           $(".mob_toggle").click(function(){
             $(".head_nav").toggleClass("active");
           });
         });
		function myGet() {
		  $("#demo").html('User Id:<input type="text" id="user_id" class="form-control" placeholder="User Id"><br/><button name="GET" id="GET" onclick="onGET(this)" class="btn btn-success">Submit</button>');
		}
		function myPost() {
		  $("#demo").html('Username:<input id="uname" type="text" class="form-control" placeholder="Username">Firstname:<input type="text" class="form-control" id="fname" placeholder="Firstname">Lastname:<input type="text" id="lname" class="form-control" placeholder="Lastname">Email Id:<input id="email" type="text" class="form-control" placeholder="Email"><br/>Password:<input required="" type="password" id="password11" name="password1" placeholder="Password"><input type="password" id="password22" name="password2" placeholder="Confirm Password"><br/><button onclick="onPOST(this)" name="POST" id="POST" class="btn btn-success">Submit</button>');
		}
		function myPut() {
		  $("#demo").html('User Id:<input id="user_id_put" onkeyup="postinput(this)" type="text" class="form-control" placeholder="User Id">Username:<input id="uname1" type="text" class="form-control" placeholder="Username">Firstname:<input id="fname1" type="text" class="form-control" placeholder="Firstname">Lastname:<input id="lname1" type="text" class="form-control" placeholder="Lastname">Email Id:<input id="email1" type="text" class="form-control" placeholder="Email"><br/><button name="PUT" id="PUT" class="btn btn-success" onclick="onPUT(this)">Submit</button>');
		}
		function myDelete() {
		  $("#demo").html('User Id:<input type="text" id="user_id_delete" class="form-control" placeholder="User Id"><br/><button name="DELETE" id="DELETE" onclick="onDELETE(this)" class="btn btn-success">Submit</button>');
		}


  // Ajax functions

  function render(data) {
    $("#user_list").html('')
    data.results.forEach(i => {
      $("#user_list").append(
        `
        <tr id="user-${i.id }">
          <td class="tb_chk_box">
            <a href="#">${i.username}</a>
          </td>
          <td> ${i.first_name}</td>
          <td> ${i.last_name}</td>
          <td> ${i.email}</td>
        </tr>
        ` 
      )
    });
  }
  var page = 1

  function show_pages(data) {
    $("#pagination_nav_bar").html(`
    <nav aria-label="Page navigation example">
    <ul style="padding-left: 39px;" class="pagination justify-content-start mt-3">
    ${data.previous ? `
    <li class="page-item">
      <a class="page-link" href="javascript:void(0);" onclick=getList(${page-1})">Previous</a>
    </li>` : 
      `    
      <li class="page-item disabled">
        <a class="page-link" href="javascript:void(0);" tabindex="-1">Previous</a>
      </li>`
    }
    ${Array.from({length: data.page_count}, (_, i) => i + 1).map(page_count => `
    <li class="page-item ${page == page_count ? 'active' : ''}">
        <a class="page-link"  href="javascript:void(0);" onclick=getList(${page_count})>${page_count}</a>
    </li>
    `).join("")}
    ${data.next ? `
    <li class="page-item">
      <a class="page-link" href="javascript:void(0);" onclick=getList(${page+1})">Next</a>
    </li>` : 
      `    
      <li class="page-item disabled">
        <a class="page-link" href="javascript:void(0);" tabindex="-1">Next</a>
      </li>`
    }
    </ul>
  </nav>
  `)
  }


  function getList(p_num=1) {
    page = p_num
    getListAPI()
  }

  function getListAPI(){
    $.ajax({
      url: `/users/`,
      "type": 'get',
      "data":{page: page},
       success: function (data) {
       render(data)
       show_pages(data)
       },
       error: function (data) {
       },
    });
  }
            function getCookie(name) {
              var cookieValue = null;
              if (document.cookie && document.cookie != '') {
                  var cookies = document.cookie.split(';');
                  for (var i = 0; i < cookies.length; i++) {
                      var cookie = jQuery.trim(cookies[i]);
                      // Does this cookie string begin with the name we want?
                      if (cookie.substring(0, name.length + 1) == (name + '=')) {
                          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                          break;
                      }
                  }
              }
              return cookieValue;
            }
      function onGET(e){
      id=document.getElementById('user_id').value;

                       $.ajaxSetup({
                                   beforeSend: function(xhr, settings) {
                                       if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url)))
                                        {
                                           // Only send the token to relative URLs i.e. locally.
                                           xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
                                        }
                                    }
                                   });
                        var url = '/edit/';
                       $.ajax({
                                url: `${url}${id}/`,
                                "type": e.id,
                                "beforeSend": function(xhr, settings) {
                                    $.ajaxSettings.beforeSend(xhr, settings);
                                 },
                                 "data":{'id':id,'method':e.id},
                                 success: function (data) {
                                document.getElementById("demo2").innerHTML=JSON.stringify(data);
                                 },
                                 error: function (data) {
                                document.getElementById("demo2").innerHTML=data.responseJSON.detail;
                                 },


                         });
            }
            function onDELETE(e){
                        id=document.getElementById('user_id_delete').value;

                       $.ajaxSetup({
                                   beforeSend: function(xhr, settings) {
                                       if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url)))
                                        {
                                           // Only send the token to relative URLs i.e. locally.
                                           xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
                                        }
                                    }
                                   });
                        var url = '/edit/';
                       $.ajax({
                                url: `${url}${id}/`,
                                "type": e.id,
                                "beforeSend": function(xhr, settings) {
                                    $.ajaxSettings.beforeSend(xhr, settings);
                                 },
                                 "data":{'id':id,'method':e.id},
                                 success: function (data) {
                                 getListAPI()
                                document.getElementById("demo2").innerHTML='Successfully Deleted';
                                 },
                                 error: function (data) {
                                document.getElementById("demo2").innerHTML=data.responseJSON.detail;
                                 },


                         });
            }

            function onPOST(e){
                  uname=document.getElementById('uname').value;
                  fname=document.getElementById('fname').value;
                  lname=document.getElementById('lname').value;
                  email=document.getElementById('email').value;
                  password11=document.getElementById('password11').value;
                  password22=document.getElementById('password22').value;

                       $.ajaxSetup({
                                   beforeSend: function(xhr, settings) {
                                       if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url)))
                                        {
                                           // Only send the token to relative URLs i.e. locally.
                                           xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
                                        }
                                    }
                                   });
                        var url = $("#demo").attr("data-cities-url");
                       $.ajax({
                                url: url,
                                "type": e.id,
                                "beforeSend": function(xhr, settings) {
                                    $.ajaxSettings.beforeSend(xhr, settings);
                                 },
                                 "data":{'method':e.id,'username':uname,'first_name':fname,'last_name':lname,'email':email,'password1':password11,'password2':password22},
                                 success: function (data) {
                                  getListAPI()
                                document.getElementById("demo2").innerHTML=JSON.stringify(data.data);
                                 },
                                 error: function (data) {
                                document.getElementById("demo2").innerHTML=JSON.stringify(data.responseJSON.error);
                                 },


                         });
            }
               function onPUT(e){
                  id=document.getElementById('user_id_put').value;
                  uname=document.getElementById('uname1').value;
                  fname=document.getElementById('fname1').value;
                  lname=document.getElementById('lname1').value;
                  email=document.getElementById('email1').value;

                       $.ajaxSetup({
                                   beforeSend: function(xhr, settings) {
                                       if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url)))
                                        {
                                           // Only send the token to relative URLs i.e. locally.
                                           xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
                                        }
                                    }
                                   });
                        var url = '/edit/';
                       $.ajax({
                                url: `${url}${id}/`,
                                "type": e.id,
                                "beforeSend": function(xhr, settings) {
                                    $.ajaxSettings.beforeSend(xhr, settings);
                                 },
                                 "data":{'method':e.id,'id':id,'username':uname,'first_name':fname,'last_name':lname,'email':email},
                                 success: function (data) {
                                 getListAPI()
                                document.getElementById("demo2").innerHTML=JSON.stringify(data);
                                 },
                                 error: function (data) {
                                document.getElementById("demo2").innerHTML=JSON.stringify(data.responseJSON.detail);
                                 },


                         });
            }

            function postinput(e){
                       id=document.getElementById('user_id_put').value;
                       $.ajaxSetup({
                                   beforeSend: function(xhr, settings) {
                                       if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url)))
                                        {
                                           // Only send the token to relative URLs i.e. locally.
                                           xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
                                        }
                                    }
                                   });
                        var url = $("#update").attr("data-cities-url");
                       $.ajax({
                                url: url,
                                "type": 'GET',
                                "beforeSend": function(xhr, settings) {
                                    $.ajaxSettings.beforeSend(xhr, settings);
                                 },
                                 "data":{'id':id},
                                 success: function (data) {
                                document.getElementById("uname1").value = data.data['username'];
                                document.getElementById("fname1").value = data.data['first_name'];
                                document.getElementById("lname1").value = data.data['last_name'];
                                document.getElementById("email1").value = data.data['email'];
                                document.getElementById("demo2").innerHTML='';
                                 },
                                 error: function (data) {
                                document.getElementById("uname1").value = '';
                                document.getElementById("fname1").value = '';
                                document.getElementById("lname1").value = '';
                                document.getElementById("email1").value = '';
                                document.getElementById("demo2").innerHTML=JSON.stringify(data.responseJSON.message);
                                 },


                         });
            }