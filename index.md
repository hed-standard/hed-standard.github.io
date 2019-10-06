![](/images/HED_connected_logo_100.png)

## What is HED?

HED (Hierarchical Event Descriptors) is a framework for systematically describing both laboratory and real-world events. HED tags are comma-separated path strings. The allowed HED tags are organized in a forest of groups with the roots *Event*, *Item*, *Sensory presentation*, *Attribute*, *Action*, *Participant*, *Experiment context*, and *Paradigm* (view the visualization of HED tags below).

The goal of HED is to describe precisely the nature of the events of interest occurring in an experiment using a common language, so that the following two things can be accomplished. First, you and/or other researchers can better understand the experience and responses of the participant. Secondly, data analysis and meta-analysis can more easily and flexibly compare events (and responses to events) across datasets and studies to better isolate common “cognitive aspects”.

Event annotation comes in two forms: code-specific and event-specific. In code-specific event annotation, researchers identify a small number of event classes or categories and annotate events by category. In event-specific event annotation, researchers identify events with specific values for continuous parameters and annotate events by the times at which the events occur.

The HED framework has been developed for application to EEG brain imaging, but may also be applied to other brain imaging (MEG, fNIRS), multimodal (a.k.a, mobile brain/body imaging), physiological (ECG, EMG, GSR), or purely behavioral data. HED has recently been adopted as part of the BIDS ([Brain Imaging Data Structure](http://bids.neuroimaging.io)) standard for brain imaging.

## The HED Schema

The [HED Schema](http://www.hedtags.org/schema) contains allowed HED tags and describes their properties. It is partially adopted from BrainMap/NeuroLex ontologies and organized hierarchically. You can click on the image below for an interactive visualization of HED hierarchy:

[<img src="/images/HED_tree_brief.png">](/interactive)

## How do I start?

Check out the [Documentation page]({{ site.url }}/hed-docs) to start using HED tools to tag your data.  

## Who is using HED tags?

* [Brain Imaging Data Structure (BIDS)](https://www.nature.com/articles/s41597-019-0104-8). Also check out [BIDS specification of HED](https://bids-specification.readthedocs.io/en/stable/99-appendices/03-hed.html)
* [National Database for Autism Research (NDAR)](http://ndar.nih.gov/)
* [CaN-CTA project of Army Research Labaratory](http://cancta.net)
* [EEG Study Schema (ESS)](http://www.eegstudy.org)
* [HeadIT.org](http://HeadIT.org)

## People

* Nima Bigdely-Shamlo
* Kay Robbins ([University of Texas San Antonio](https://www.utsa.edu/))
* Scott Makeig ([Swartz Center, UCSD](http://sccn.ucsd.edu)).
* Arnaud Delorme ([Swartz Center, UCSD](http://sccn.ucsd.edu)).
* Dung Truong ([Swartz Center, UCSD](http://sccn.ucsd.edu)).
* Ian Callanan ([University of Texas San Antonio](https://www.utsa.edu/))
* Alexander Jones ([University of Texas San Antonio](https://www.utsa.edu/))
* Aaron Hodson ([University of Texas San Antonio](https://www.utsa.edu/))
* Owen Winterberg ([University of Texas San Antonio](https://www.utsa.edu/))
* Makoto Miyakoshi ([Swartz Center, UCSD](http://sccn.ucsd.edu)).

and many others.

## Institutions

<div width = "100%"  align = "center" style="float:center">
<img src="http://bigeegconsortium.github.io/combined_logos_2.png" align="center" >
</div>

- [Intheon Labs](https://intheon.io)
- [University of Texas at San Antonio](http://visual.cs.utsa.edu/)
- [Swartz Center for Computational Neuroscience, University of California, San Diego](http://sccn.ucsd.edu)

***

HED was originally developed under HeadIT project at Swartz Center for Computational Neuroscience (SCCN) of the University of California, San Diego and funded by U.S. National Institutes of Health grants R01-MH084819 (Makeig, Grethe PIs) and R01-NS047293 (Makeig PI). HED development is now supported by The Cognition and Neuroergonomics Collaborative Technology Alliance (CaN CTA) program of U.S Army Research Laboratory (ARL).
<div width = "100%">
<div width = "100%" align = "center" style="float:left">
<a href="http://www.arl.army.mil/"  align="center"><img src="/images/ARL_logo.png" align="centeer" height="50px" ></a>
</div>
</div>
<p/>
