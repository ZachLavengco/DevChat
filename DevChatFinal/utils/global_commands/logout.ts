import {auth} from '../firebase'

export async function logout () {

    console.log('loggingout in yp',auth)
    if (auth.currentUser!=null){
        
        let res =  await auth.signOut().then(function() {
            // Sign-out successful.
            if(auth.currentUser==null){
                return 'logged out successfully'
            }
            else{
                return 'failed : logout was not successful'
            }
          }, function(error) {
            // An error happened.
            console.log("logout error - ",error)
            return 'failed : error occoured while trying to logout'
          });
        
        return res
                 
    }
    else{
        return 'failed : cannot logout as user is not logged in';
    }
    
} ;
