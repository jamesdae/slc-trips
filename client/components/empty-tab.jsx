import React from 'react';

export default function EmptyTabAlert({ tab }) {
  return (
    <div className='flex-fill'>
      <div className="alert alert-primary" role="alert">
        {tab === 'routes'
          ? (
            <div>
              <h4 className="alert-heading">No locations pinned yet.</h4>
              <p className='py-2'>Add locations to My List, then click <button className="mybuttons btn btn-success" type="button" >Pin</button> to see locations here.</p>
            </div>
            )
          : (
            <div>
              <h4 className="alert-heading">No locations added yet.</h4>
              <p className='py-2'>Click Places above, and press <button className="mybuttons btn btn-success" type="button" >Add</button> to see locations here.</p>
            </div>
            )
        }
        <hr />
        <p className="mb-0">Sign in <a href="#" className="alert-link">here</a> to save your changes!</p>
      </div>
    </div>
  );
}
