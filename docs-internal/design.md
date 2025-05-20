# Design

The design here is a bit mixed which is bad. I started out with looking at tailwind. 
The idea was that it would bring some consistency. 
That started to get complicated while I was also learning Astro. 

It also seems better to use rem instead of the hard pixel value I was using before. 
rem means that a user can increase the size of the text in the browser and everything scales up. 
Also scaling down works pretty nice. 

## JSX components vs Astro components
It's possible to make everything into Astro components but I already have much of the work in TSX. 
There is no reason at the moment not to go with that. 
I'll have to see later if there are reasons to switch this to `Astro` components. 

