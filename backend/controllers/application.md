applyForJob()
       ↓
Student → Job → Application


getAllApplications()
       ↓
Admin → all applications


getMyApplications()
       ↓
User → Student → own applications


getApplicationById()
       ↓
Admin → any application
Student → own application only


updateApplicationStatus()
       ↓
Admin → change application status