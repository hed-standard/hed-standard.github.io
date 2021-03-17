
## What is HED?

HED (for ‘Hierarchical Event Descriptors’) is a framework for systematically describing laboratory and real-world events using a controlled but extensible vocabulary. HED tags are comma-separated path strings assigned from a tree-structured vocabulary called a **HED schema**. HED tags give information about experiment organization and detail the nature of each experiment event, thus creating a permanent record accompanying the data for use in any analysis, later re-analysis, or meta-analysis.

HED tags may also be use to annotate to other brain imaging (MEG, fNIRS), multimodal (a.k.a, mobile brain/body imaging), physiological (ECG, EMG, GSR), or purely behavioral experiment data. HED has recently been adopted as part of the BIDS ([Brain Imaging Data Structure](http://bids.neuroimaging.io/)) standard at the top level, thus becoming a part of the BIDS data saving standards for an increasing number of brain imaging modalities. Annotation, validation, and data search tools using HED are currently available for use online and/or for use in the [EEGLAB](https://sccn.ucsd.edu/eeglab)/MATLAB environment.

## Why use HED?

Some compelling reasons for using HED are to ensure the continued usability and reuse of data, and to provide compatibility among recorded event descriptions for different experiments, all while retaining flexibility to extend HED descriptive vocabulary to describe events of interest to any research community.

By providing a standardized documentation framework, a controlled vocabulary, and easy-to-use HED string selection and validation tools, HED allows users to annotate their data in a consistent way that preserves its original meaning – in a format that is both human and machine readable. Using a common vocabulary to describe experiment events and organization also enables new meta-analysis across studies, with a goal of better identifying common data features. 

> For example
>
> Given HED-tagged data from a number of fairly similar EEG experiments:
>
> Experiment 1 (Lab A): “Press the button when you see a red circle.”
> Experiment 2 (Lab B): “Press the button when you see a black triangle.”
> Experiment 3 (Lab C): Count the number of times you see the black square.”
> Experiment 4   ….
>
> By contrasting the brain responses evoked by these ‘visual sensory presentation’ events, one can begin to ask: What task/stimulus features produce robust differences in the event-related brain dynamics or in a given feature/measure of the event-related brain dynamics? 
>
> Currently, sophisticated ‘machine learning’ algorithms can be made to combine information from many such records so as to give new insights that could not be obtained by contrasting a small number of experiment conditions. 
>
> To make this mode of discovery possible for brain imaging or behavioral experiments, (1) the nature of the participant sensory experiences and actions need to be recorded in sufficient detail, using a common vocabulary and format, and (2) the data need to be co-located or co-registered in a way that allows selective ‘meta-‘ or ‘large scale’ analysis.



The path string format of HED annotation allows data search and analysis focused at any level of detail (for example: collect all visual sensory presentation events, collect all ‘target’ visual sensory presentation events, or collect all *audio*visual sensory presentation events, … ).

HED also allows researchers to add annotations in layers. A researcher might provide an initial set of event annotations. Later, an additional layer of HED tags might document finer aspects of those events, or might annotate additional ‘data feature’ events discovered through *post hoc* review or analysis. HED tools allow these annotation layers to be combined in a transparent way for use in a particular analysis.

## The HED Schema

The HED schema contains tags and tag properties allowed in HED annotation, organized in a tree-like structure in which an item of a lower level particularizes its predecessor. The top-level (root) categories are fixed so as to be standardized and shared across the whole research community. 

[Browse the current HED Schema](http://www.hedtags.org/display_hed.html).

Lower levels of the schema hierarchy (leaves and smaller branches) are extensible so as to permit and encourage more research community-specific annotation. 

> For example, a community of music/brain researchers might want to annotate experimental events using musical terms (B-flat minor, legato, semidemiquaver, …) that would not be created by nor meaningful to other research communities. 
>
> Clinical neurophysiologists might annotate EEG data using a shared set of standard clinical terms (sleep spindle, interictal spike, …), etc.

HED validation tools allow users to specify the version of the HED schema used to annotate the data. This flexibility allows communities to develop specialized HED schema to fit their needs.


## How do I start?

Check out the [Documentation page]({{ site.url }}/hed-docs) to start using HED tools to tag your data.  

## The HED community

The HED project is an ongoing open-source organization whose repositories can be found at
[the HED standards Github site](https://github.com/hed-standard). Visit this site for more information on how to join the HED
community of developers and users.

## Support 

HED was originally developed by Nima Bigdely-Shamlo with Scott Makeig under the HeadIT.org project at the Swartz Center for Computational Neuroscience (SCCN) of the University of California, San Diego and funded by U.S. National Institutes of Health grants R01-MH084819 (Makeig, Grethe PIs) and R01-NS047293 (Makeig PI). Further HED development was supported by The Cognition and Neuroergonomics Collaborative Technology Alliance (CaN CTA) program of U.S Army Research Laboratory (ARL) under Cooperative Agreement Number W911NF-10-2-0022, with strong and continuing contributions by Kay Robbins of the University of Texas San Antonio. HED is currently (2020) maintained by [Scott Makeig](http://smakeig@ucsd.edu) and Dung Truong at the Swartz Center, UCSD. 