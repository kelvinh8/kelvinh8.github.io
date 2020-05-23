import {getTeams,getTeamById,getSavedTeams,getMatchesById} from './api.js';

//initialize sidenav
const sidenav = document.querySelector('.sidenav');
M.Sidenav.init(sidenav);

const loadPage = page=>{
  let teamId;
  if(page === '')page = 'home';
  if(/^(detail)\d+$/.test(page)){
    teamId = page.replace('detail','');
    page = 'detail';
  }
  if(/^(match)\d+$/.test(page)){
    teamId = page.replace('match','');
    page = 'match';
  }
  $.ajax({
    type:'GET',
    url:`./pages/${page}.html`
  }).then(response=>{
    $('#body-content').html(response)
    if(page === 'home'){
      $('a[href="#team"]').click(evt=>{
        loadPage('team')
      })
    }
    if(page === 'team'){
      getTeams();
    }
    if(page === 'detail'){
      getTeamById(teamId)
    }
    if(page === 'saved'){
      getSavedTeams()
    }
    if(page === 'match'){
      getMatchesById(teamId);
    }
  }).catch(err=>{
    $('#body-content').html(`
    <div class="row message-container">
      <img class="message-img" src="/assets/soccer2.png">
      <div class="col s12">
        <h1>Halaman tidak ditemukan.</h1>
      </div>
    </div>
    `)
  })
}

let page = window.location.hash.substr(1).toLowerCase();
loadPage(page);
$('.topnav a,.sidenav a').click(evt=>{
  M.Sidenav.getInstance(sidenav).close();

  page = evt.currentTarget.getAttribute('href').substr(1);
  loadPage(page);
})
export {loadPage}