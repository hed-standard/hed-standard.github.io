---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: default
---
HED (Hierarchical Event Descriptors) is a framework for annotating event data. This site hosts HED documentation
and some examples of annotation.

## How do I annotate my data in HED?

A simple workflow for annotation is to create a spreadsheet containing events and their corresponding HED annotations.
Researchers can then use an [online validator](https://hedtools.ucsd.edu/hed) to validate their annotations without installing
other tools. The [CTagger](https://github.com/hed-standard/CTagger) tool provides a graphical user
interface for doing annotation. HED validators
are also available in [Python](https://github.com/hed-standard/hed-python) and 
[JavaScript](https://github.com/hed-standard/hed-javascript).  

Event annotation typically two forms: code-specific and event-specific. In **code-specific annotation**, researchers
identify a small number of event classes or categories and annotate the categories with HED tags. Downstream tools
then map the HED tags to event instances during analysis. In **event-specific annotation**, researchers tag
individual event instances. One can combine these approaches, using code-specific annotation to describe common
properties, for example that events with this code represent visual target events. An additional event-specific
layer might be provided to label the location of the target in each individual event. Researchers can choose the
layers of interest during downstream analysis. HED also supports data feature annotations.  

## Using HEDTools plug-in for EEGLAB
HED annotation is integrated into [EEGLAB](https://sccn.ucsd.edu/eeglab), a MATLAB toolbox for processing EEG brain
imaging data. There are two ways to install the HEDTools EEGLAB plug-in:
1. In EEGLAB, go to File > Manage EEGLAB extensions. Look for HEDTools and install it.
2. Alternatively, you can download the [plug-in zip file](https://github.com/hed-standard/hed-matlab/tree/master/EEGLABPlugin) and extract it into EEGLAB *plugins* folder. Restart EEGLAB.

Check out the [Quick guide](quick-guide.md) to start tagging your EEG data.

## Using spreadsheet and HED validators
Follow the instructions on the [HED validator page](https://hedtools.ucsd.edu/hed/spreadsheet) to prepare your event-HED
tag spreadsheet and to validate it with the HED validator.

## Tagging Strategy Guide
Once you are familiar HED basics, check out the
[HED Tagging Strategy Guide](HEDTaggingStrategyGuide.pdf) for some practical annotation strategies.

## Other links

[hedtags.org](https://hedtags.org) is the home page for HED tag users.  

[hed-standard](https://github.com/hed-standard) is the HED community organization repository for HED development.
