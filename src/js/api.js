import moment from 'moment';
import {loadPage} from './ui.js';
import {saveForLater,removeSaved,getAll,isExist} from './db.js';
const API_KEY = '9b31090e2b544928b90d4f953a2d1715';

const getRequest = (url)=>{
  const BASE_URL = 'https://api.football-data.org/';
  return $.ajax({
    headers: { 'X-Auth-Token': API_KEY },
    url: `${BASE_URL}${url}`,
    dataType: 'json',
    type: 'GET'
  })
}

const getTeams = ()=>{
  getRequest('v2/teams/')
  .then(async(response)=>{
  let teams = response.teams;
  let teamsHtml = '';
  for(const team of teams){
    if(team.crestUrl){
      const url = team.crestUrl.replace(/^http:\/\//i, 'https://');
      const lastUpdated = moment(team.lastUpdated).format('L');
      await isExist(team.id)
      .then(button=>{
      teamsHtml += `
      <div class="card-column col m12 l6">
        <div class="card horizontal">
          <div class="card-image">
              <img src="${url}" alt="${team.name} logo">
              ${button}
          </div>
          <div class="card-stacked">
            <div class="card-content">
              <h2 class="card-title">${team.shortName}</h2>
              <p class="grey-text date">Updated ${lastUpdated}</p>
              <a href="#detail${team.id}" class="btn page-detail"><i class="material-icons left">zoom_in</i>View Page</a>
            </div>
          </div>
        </div>
      </div>
      `

      })
  }
  }
  $('#team-container').html(teamsHtml);
    $('#team-container').append(`
    <div id="save-modal" class="modal">
      <div class="modal-content">
        <span>Saved <span class="save-name"></span> to Saved List.</span>
      </div>
    </div>
    <div id="delete-modal" class="modal delete-modal">
      <div class="modal-content">
        <span>Deleted <span class="delete-name"></span> From Saved List.</span>
      </div>
    </div>
    `);
    $('.card-image').click(evt=>{
      const clickedContent = evt.target.textContent;
      if(clickedContent === 'favorite'){
        const saveModal = document.querySelector('.modal');
        const saveName = evt.target.parentElement.parentElement.nextElementSibling.firstElementChild.firstElementChild.textContent;
        const id = evt.target.parentElement.dataset.id;
        const clickedResponse = response.teams.filter(team=>{
          return team.id == id
        })
        const cardImage = evt.target.parentElement.parentElement;
        $('.save-name').html(`${saveName}`);
        saveForLater(clickedResponse[0]);
        M.Modal.init(saveModal);
        $(evt.target.parentElement).addClass('scale-out');
        $(cardImage).append(`
        <a class="btn-floating red pulse halfway-fab modal-trigger delete-team scale-out scale-transition" data-id="${id}" data-target="delete-modal">
          <i class="material-icons">remove</i>
        </a>
        `)
        setTimeout(()=>{
          M.Modal.getInstance(saveModal).close();
          $(cardImage.lastElementChild).toggleClass('scale-out');
        },2000)
      }
      if(clickedContent === 'remove'){
        const deleteModal = document.querySelectorAll('.modal')[1];
        const deleteName = evt.target.parentElement.parentElement.nextElementSibling.firstElementChild.firstElementChild.textContent;
        const id = evt.target.parentElement.dataset.id;
        const clickedResponse = response.teams.filter(team=>{
          return team.id == id
        })
        const cardImage = evt.target.parentElement.parentElement;
        $('.delete-name').html(`${deleteName}`);
        removeSaved(clickedResponse[0].id);
        M.Modal.init(deleteModal);
        $(evt.target.parentElement).addClass('scale-out');
        $(cardImage).append(`
        <a class="btn-floating pink pulse halfway-fab modal-trigger save-team scale-transition scale-out" data-target="save-modal" data-id="${id}">
          <i class="material-icons">favorite</i>
        </a>
        `);
        setTimeout(()=>{
          M.Modal.getInstance(deleteModal).close();
          $(cardImage.lastElementChild).toggleClass('scale-out')
        },2000)
      }
    })
    $('.page-detail').click(evt=>{
      const page = evt.currentTarget.getAttribute('href').substr(1);
      loadPage(page);
    })
  }).catch(err=>{
    if(err.readyState == 0){
      $('#team-container').html(`
      <div class="row message-container">
        <img class="message-img" src="/assets/soccer2.png">
        <div class="col s12">
            <h1>OOPS... You Need To Download This Page.</h1>
        </div>
     </div>
      `)
    }
  })
}
const getTeamById = (id)=>{
  getRequest(`v2/teams/${id}`)
  .then(response=>{
    if(response.crestUrl){
      const url = response.crestUrl.replace(/^http:\/\//i, 'https://');
      const lastUpdated = moment(response.lastUpdated).format('L');
      isExist(id).then(button=>{
        let teamHtml = `
        <div class="card horizontal col s12">
          <div class="card-image">
              <img src="${url}" alt="${response.name} logo">
              ${button}
          </div>
          <div class="card-stacked">
            <div class="card-content">
              <h2 class="card-title">${response.name}</h2>
              <p class="grey-text date">Last Updated : ${lastUpdated}</p>
              <p class="grey-text">Address : ${response.address}</p>
              <p class="grey-text">Venue : ${response.venue}</p>
              <p class="grey-text">Founded : ${response.founded}</p>
              <p class="grey-text">Website : <a href="${response.website}" target="_blank">${response.website}</a></p>
              <a class="btn matches" href="#match${response.id}">
                <i class="material-icons left">event</i>
                Matches
              </a>
            </div>
          </div>
        </div>
        <div class="col s12 squad">
          <ul class="collection with-header">
            <li class="collection-header"><h4 class="squad-header"><i class="material-icons left">people</i>Squad</h4></li>
    
          </ul>
        </div>
        `
        const squad = response.squad;
        let squadHtml = '';
        squad.map(player=>{
          squadHtml += `
            <li class="collection-item avatar">
              <i class="material-icons circle amber darken-4">perm_identity</i>
              <span class="title">${player.name}</span>
              <p class="grey-text">${player.position}</p>
              <p class="grey-text"></p>
            </li>
          `
        })
        $('#detail-container').html(teamHtml);
        $('#detail-container').append(`
        <div id="save-modal" class="modal">
          <div class="modal-content">
            <span>Saved <span class="save-name"></span> to Saved List.</span>
          </div>
        </div>
        <div id="delete-modal" class="modal delete-modal">
          <div class="modal-content">
            <span>Deleted <span class="delete-name"></span> From Saved List.</span>
          </div>
        </div>
        `);
        $('.matches').click(evt=>{
          const page = evt.currentTarget.getAttribute('href').substr(1);
          loadPage(page);
        })
        $('.card-image').click(evt=>{
          const clickedContent = evt.target.textContent;
          if(clickedContent === 'favorite'){
            const saveModal = document.querySelector('.modal');
            const saveName = evt.target.parentElement.parentElement.nextElementSibling.firstElementChild.firstElementChild.textContent;
            const id = evt.target.parentElement.dataset.id;
            const cardImage = evt.target.parentElement.parentElement;
            $('.save-name').html(`${saveName}`);
            saveForLater(response);
            M.Modal.init(saveModal);
            $(evt.target.parentElement).addClass('scale-out');
            $(cardImage).append(`
            <a class="btn-floating red pulse halfway-fab modal-trigger delete-team scale-out scale-transition" data-id="${id}" data-target="delete-modal">
              <i class="material-icons">remove</i>
            </a>
            `)
            setTimeout(()=>{
              M.Modal.getInstance(saveModal).close();
              $(cardImage.lastElementChild).toggleClass('scale-out')
              
            },2000)
          }
          if(clickedContent === 'remove'){
            const deleteModal = document.querySelectorAll('.modal')[1];
            const deleteName = evt.target.parentElement.parentElement.nextElementSibling.firstElementChild.firstElementChild.textContent;
            const id = evt.target.parentElement.dataset.id;
            const cardImage = evt.target.parentElement.parentElement;
            $('.delete-name').html(`${deleteName}`);
            removeSaved(id);
            M.Modal.init(deleteModal);
            $(evt.target.parentElement).addClass('scale-out');
            $(cardImage).append(`
            <a class="btn-floating pink pulse halfway-fab modal-trigger save-team scale-transition scale-out" data-target="save-modal" data-id="${id}">
              <i class="material-icons">favorite</i>
            </a>
            `);
            setTimeout(()=>{
              M.Modal.getInstance(deleteModal).close();
              $(cardImage.lastElementChild).toggleClass('scale-out')
            },2000)
          }
        })
        $('.collection').append(squadHtml)
      });
    }
  })
  .catch(err=>{
    if(err.readyState == 0){
      $('#detail-container').html(`
    <div class="row message-container">
      <img class="message-img" src="/assets/soccer2.png">
      <div class="col s12">
          <h1>OOPS... You Need To Download This Page.</h1>
      </div>
    </div>
    `)
    }else{
      $('#detail-container').html(`
      <div class="row message-container">
        <img class="message-img" src="/assets/soccer2.png">
        <div class="col s12">
            <h1>404 Not Found!!!</h1>
        </div>
      </div>
      `)
    }
  })
}

const getSavedTeams = ()=>{
  getAll()
  .then(teams=>{
    let teamsHtml = '';
    teams.forEach(team=>{
      if(team.crestUrl){
        const url = team.crestUrl.replace(/^http:\/\//i, 'https://');
        const lastUpdated = moment(team.lastUpdated).format('L');
        teamsHtml += `
        <div class="card-column col m12 l6 scale-transition">
          <div class="card horizontal">
            <div class="card-image">
                <img src="${url}" alt="${team.name} logo">
                <a class="btn-floating red pulse halfway-fab modal-trigger delete-team" data-target="delete-modal" data-id=${team.id}>
                  <i class="material-icons">remove</i>
                </a>
            </div>
            <div class="card-stacked">
              <div class="card-content">
                <h2 class="card-title">${team.shortName}</h2>
                <p class="grey-text date">Updated ${lastUpdated}</p>
                <a href="#detail${team.id}" class="btn page-detail"><i class="material-icons left">zoom_in</i>View Page</a>
              </div>
            </div>
          </div>
        </div>
        `
      }
    })
    $('#saved-container').html(teamsHtml);
    $('#saved-container').append(`
    <div id="delete-modal" class="modal">
      <div class="modal-content">
        <span>Deleted <span class="delete-name"></span> From Saved List.</span>
      </div>
    </div>
    `);
    $('.delete-team').click(evt=>{
      const cardColumn = evt.currentTarget.parentElement.parentElement.parentElement;
      const id = evt.currentTarget.dataset.id;
      const modal = document.querySelector('.modal');
      const deleteName = evt.currentTarget.parentElement.nextElementSibling.firstElementChild.firstElementChild.textContent;
      
      removeSaved(id);
      $(cardColumn).addClass('scale-out');
      $('.delete-name').html(`${deleteName}`);
      M.Modal.init(modal);
      setTimeout(()=>{
        M.Modal.getInstance(modal).close()
      },2000)
    })
    $('.page-detail').click(evt=>{
      const page = evt.currentTarget.getAttribute('href').substr(1);
      loadPage(page);
    })
  })
  .catch(err=>{
    $('#saved-container').html(err)
  })
}
const getMatchesById = (id)=>{
  getRequest(`v2/teams/${id}/matches/`)
  .then(response=>{
    $('#match-container').removeClass('message-container');
    const matches = response.matches;
    let tableRows = '';
    $('#match-container').html(`
    <table class="responsive-table highlight centered">
        <thead>
          <tr>
              <th>Competition</th>
              <th>Date</th>
              <th>Home Team</th>
              <th>Away Team</th>
              <th>Winner</th>
              <th>Status</th>
          </tr>
        </thead>
        <tbody class="table-body">
        </tbody>
      </table>
    `)
    matches.forEach(match=>{
      const date = moment(match.utcDate).format('L');
      switch(match.status){
        case "FINISHED":
        tableRows += `
        <tr>
          <td>${match.competition.name}</td>
          <td>${date}</td>
          <td>${match.homeTeam.name}</td>
          <td>${match.awayTeam.name}</td>
          <td>${match.score.winner}</td>
          <td>${match.status}</td>
        </tr>
        `;
        break;
        case "POSTPONED":
          tableRows += `
          <tr>
            <td>${match.competition.name}</td>
            <td>${date}</td>
            <td>${match.homeTeam.name}</td>
            <td>${match.awayTeam.name}</td>
            <td>-</td>
            <td>${match.status}</td>
          </tr>
          `;
          break;
      }
    })
    $('.table-body').html(tableRows)
  })
  .catch(err=>{
    if(err.readyState == 0){
      $('#match-container').html(`
    <div class="row message-container">
      <img class="message-img" src="/assets/soccer2.png">
      <div class="col s12">
          <h1>OOPS... You Need To Download This Page.</h1>
      </div>
    </div>
    `)
    }else{
      $('#match-container').html(`
      <div class="row message-container">
        <img class="message-img" src="/assets/soccer2.png">
        <div class="col s12">
            <h1>404 Not Found!!!</h1>
        </div>
      </div>
      `)
    }
  })
}
export {getTeams,getTeamById,getSavedTeams,getMatchesById};