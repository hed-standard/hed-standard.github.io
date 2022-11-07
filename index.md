
## What is HED?
- **HED** (‘**Hierarchical Event Descriptors**’, pronounced either as /hed/ or /H//E//D/) is a framework for using a controlled yet extensible vocabulary to systematically describe experiment events of all types (perceptual, action, experiment control, task, etc.).

- The **goals of HED** are to enable and support its users to **store and share** recorded data in a fully **analysis-ready** format, and to support efficient data **search and analysis**. 
- HED enables users to use a standard method to **detail** **the nature** of each experiment event, and to record information about **experiment organization**, thus creating a permanent, both human- and machine-readable record embedded in the data record for use in any further **analysis, re-analysis, and meta/mega-analysis**.
- HED may be used to annotate **any time series data** – in particular data acquired in functional brain imaging (EEG, MEG, fNIRS, fMRI), multimodal (aka MoBI, mobile brain/body imaging), psychophysiological (ECG, EMG, GSR), or purely behavioral experiments. 
- HED string **event markers** are composed of comma-separated **tags** that use a formally **specified syntax** and multi-tree **structured vocabulary** (maintained in the base **HED schema)**. 
- HED vocabulary extensions for use in individual research subfields are housed in **HED library schemas**.
- The **HED working group** is an ongoing open-source organization to maintain and extend the HED standard. Visit the [hed-standard site on Github](https://github.com/hed-standard) for **information on how to join the HED community** of users and developers.

## HED and BIDS

- HED was accepted (2019) into the top-level BIDS ([**Brain Imaging Data Structure**](http://bids.neuroimaging.io/)) standard, thus becoming an integral part of the BIDS data storage standards for an ever increasing number of neuroimaging data modalities. 
- An efficient approach to integrating HED information into BIDS metadata has been demonstrated in this [2021 paper](https://doi.org/10.1016/j.neuroimage.2021.118766).

## HED Tools

Data annotation, validation, search, and extraction tools using HED are currently **available for use [online](https://hedtools.ucsd.edu/hed/)**, as well as for use in the [**EEGLAB environment**](https://sccn.ucsd.edu/eeglab) running on Matlab.

## Where to begin?

To begin using HED tools to tag, search, and analyze data, browse the [**HED documentation page**](https://hed-examples.readthedocs.io/en/latest/index.html).

## History and Support 

<p style="font-size:15px">HED (<em>Gen 1</em>) was first proposed and developed by Nima Bigdely-Shamlo within the HeadIT project at the Swartz Center for Computational Neuroscience (SCCN) of the University of California San Diego (UCSD) under funding by The Swartz Foundation and by U.S. National Institutes of Health (NIH) grants R01-MH084819 (Makeig, Grethe PIs) and R01-NS047293 (Makeig PI). Further HED (<em>Gen 2</em>) development lead by Kay Robbins of the University of Texas San Antonio was funded by The Cognition and Neuroergonomics Collaborative Technology Alliance (CaN CTA) program of U.S Army Research Laboratory (ARL) under Cooperative Agreement Number W911NF-10-2-0022,. HED (<em>Gen 3, schema version 8.0.0.0+</em>) is now maintained and further developed by the HED Working Group lead by Kay Robbins and <a href='http://smakeig@ucsd.edu/'>Scott Makeig</a> with Dung Truong, Monique Denissen, Dora Hermes Miller, Tal Pal Attia, and Arnaud Delorme, with funding from NIH grant (<a href='https://public.era.nih.gov/grantfolder/viewCommonsStatus.era?applId=10480619&urlsignature=v1$27768473$1$cdf_MTDSKGTA2fESnRFNkygaGq9n5hhCVluTv6drBaP6ly3k2kFS267D1gX0PHR-KrenMa7iOCTh88cks7FyJvvaI9lW7GFl3BpqZfRolKZjmfnICECgp89D_9BUOCiyI8UDSiOZXsNnJb01GkxiJk4Eu-AIvUYDeU1VojxFaHlCgakC8sjX1b7tLLaIQqWxL_Ay0GMQZZzp7y3rkUi-8KFIOd5_6rxHRLx1wYM-ZYmWEKx5udF7W4HWODMxwF-D1_lhC24ET8R9MhRUJEWJ1v5zwkr-adsuRYHNNqVblP-HocHW3L8KhxL4JUf-xe5Rnmyu3wiUJnbLEWLmNwzc4g'><b>RF1-MH126700</b></a>)</p>

HED is an **open research community effort**; others interested are invited to participate and contribute -- visit [this link](https://github.com/hed-standard) to see how.
