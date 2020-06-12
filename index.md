![](/images/HED_connected_logo_100.png)

## What is HED?

HED (Hierarchical Event Descriptors) is a framework for systematically describing both laboratory and real-world events
using a controlled, extensible vocabulary. Users annotate their events and their experimental organization using
HED tags, which are comma-separated path strings. Allowed path strings are assigned from a tree-structured
vocabulary called a **HED schema**. 

The HED framework has been developed for application to EEG brain imaging, but may also be applied to other brain
imaging (MEG, fNIRS), multimodal (a.k.a, mobile brain/body imaging), physiological (ECG, EMG, GSR), or purely
behavioral data. HED has recently been adopted as part of the BIDS ([Brain Imaging Data Structure](http://bids.neuroimaging.io))
standard for brain imaging.  

## Why use HED?

Some compelling reasons for using HED are reuse, compatibility, and flexibility. By providing a standardized documentation framework
with controlled vocabulary and validation tools, HED allows users to annotate their data in a consistent way that
preserves meaning in both human and machine readable forms. The common vocabulary enables meta-analysis across
studies to better isolate common “cognitive aspects” in the data. Further, the path string format of the HED
annotation allows searching and analysis focused at different levels of detail (e.g., are
all visual events of interest or only visual targets or just events that have both a visual presentation accompanied
by an sound).  

HED allows layers of annotation. A researcher might provide an initial set of event annotations. Later,
additional annotation sets can be created to document other aspects of the data. HED tools allow these layers
to be combined in a transparent way for downstream analysis.  



## The HED Schema

The controlled vocabulary in HED annotation is determined by a HED Schema
that contains allowed HED tags and describes their properties.
(See [Latest HED Schema](http://www.hedtags.org/schema_browser/display_hed.html).)
The tree structure of HED allows top-level vocabulary to be
standardized and hence shared across the community. However, HED allows allowing extension at lower levels in the 
hierarchies to permit more experiment-specific annotations.

HED validation tools allow users to specify the version of the HED schema used to annotate the data. This flexibility
allows communities to develop specialized annotation schema.


## How do I start?

Check out the [Documentation page]({{ site.url }}/hed-docs) to start using HED tools to tag your data.  

## The HED community

The HED project is an ongoing open-source organization whose repositories can be found at
[HED standards](https://github.com/hed-standard). Visit this site for more information on how to join the HED
community of developers and users.

## Support 

HED was originally developed under HeadIT project at Swartz Center for Computational Neuroscience (SCCN) of the
University of California, San Diego and funded by U.S. National Institutes of Health grants R01-MH084819
(Makeig, Grethe PIs) and R01-NS047293 (Makeig PI). 

HED development was supported by The Cognition and Neuroergonomics Collaborative Technology Alliance (CaN CTA)
program of U.S Army Research Laboratory (ARL) under Cooperative Agreement Number W911NF-10-2-0022.

