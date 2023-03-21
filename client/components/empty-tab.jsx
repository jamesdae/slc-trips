import React from 'react';

export default function EmptyTabAlert({ tab, user, signIn }) {
  return (
    <div className='flex-fill'>
      <div className="alert alert-primary" role="alert">
        {tab === 'routes'
          ? (
            <div>
              <h4 className="alert-heading">No routes saved yet.</h4>
              {user === 'guest' ? <p className="mb-0"><button className="pe-0 btn btn-link alert-link" onClick={() => signIn()}>Sign in here</button> to make changes!</p> : <p className='py-2'>Add locations to My List, then press <i className='fa-solid fa-location-dot text-success fs-3' /> to start a new route.</p>}
            </div>
            )
          : (
            <div>
              <h4 className="alert-heading">No locations added yet.</h4>
              {user === 'guest' ? <p className="mb-0"><button className="pe-0 btn btn-link alert-link" onClick={() => signIn()}>Sign in here</button> to make changes!</p> : <p className='py-2'>Places above, and press <i className="fa-solid fa-plus text-success fs-3" /> to see locations here.</p>}
            </div>
            )
        }
      </div>
    </div>
  );
}
