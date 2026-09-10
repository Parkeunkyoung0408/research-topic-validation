# Q05 논문 검토 자료

Does retrieval augmented generation reduce hallucinations compared with language models without retrieval?

검색 점수·순위는 숨겼습니다. 나열 순서는 무작위이며 관련성을 뜻하지 않습니다.

질문 조건(초안):
- intervention_or_phenomenon: retrieval augmented generation (CORE)
- comparator: language models without retrieval (CORE)
- outcome: hallucinations (CORE)
- relation: Does retrieval augmented generation reduce hallucinations compared with language models without retrieval? (CORE)

## Ra05c278dde1d

**CareerX: A Retrieval-Augmented Generation Framework for Personalized AI-Driven Career Guidance**

출처: https://openalex.org/W4387800173 · DOI: https://doi.org/10.48550/arxiv.2310.11511

Career guidance systems must adapt to rapidly shifting labor markets, yet traditional platforms rely on static databases while standalone large language models (LLMs) are limited by training data cutoffs and prone to hallucination. This paper presents CareerX, a web-based career guidance system that augments LLM generation with live web retrieval through a SearXNG-based meta-search pipeline. The system dynamically generates personalized intake questionnaires via LLM-driven schema generation, formulates targeted search queries, scrapes and cleans live web sources, and synthesizes structured career dashboards through Zod-enforced schema-constrained generation. Unlike canonical RAG architectures that retrieve from pre-built vector stores, CareerX performs direct web retrieval — live search results are scraped and injected into the LLM context window, trading embedding-based semantic precision for real-time data currency. The system produces location-specific salary data, source-attributed university recommendations, and traceable URL citations that standalone LLMs cannot provide without retrieval augmentation. Initial measurements across three successful test profiles indicate a mean end-to-end pipeline time of 66.7 seconds (SD = 6.2s), of which LLM synthesis accounts for approximately 15–20 seconds, with an average of 37.7 web sources retrieved per session and 79% schema completeness.

## R84de73b14942

**Retrieval-Augmented Generation (RAG) in Healthcare: A Comprehensive Review**

출처: https://openalex.org/W4414128336 · DOI: https://doi.org/10.3390/ai6090226

Retrieval-Augmented Generation (RAG) enhances large language models (LLMs) by integrating external knowledge retrieval to improve factual consistency and reduce hallucinations. Despite growing interest, its use in healthcare remains fragmented. This paper presents a Systematic Literature Review (SLR) following PRISMA guidelines, synthesizing 30 peer-reviewed studies on RAG in clinical domains, focusing on three of its most prevalent and promising applications in diagnostic support, electronic health record (EHR) summarization, and medical question answering. We synthesize the existing architectural variants (naïve, advanced, and modular) and examine their deployment across these applications. Persistent challenges are identified, including retrieval noise (irrelevant or low-quality retrieved information), domain shift (performance degradation when models are applied to data distributions different from their training set), generation latency, and limited explainability. Evaluation strategies are compared using both standard metrics and clinical-specific metrics, FactScore, RadGraph-F1, and MED-F1, which are particularly critical for ensuring factual accuracy, medical validity, and clinical relevance. This synthesis offers a domain-focused perspective to guide researchers, healthcare providers, and policymakers in developing reliable, interpretable, and clinically aligned AI systems, laying the groundwork for future innovation in RAG-based healthcare solutions.

## Re99e74024cea

**Reducing hallucination in structured outputs via Retrieval-Augmented Generation**

출처: https://openalex.org/W4401042735 · DOI: https://doi.org/10.18653/v1/2024.naacl-industry.19

Orlando Ayala, Patrice Bechard. Proceedings of the 2024 Conference of the North American Chapter of the Association for Computational Linguistics: Human Language Technologies (Volume 6: Industry Track). 2024.

## R2ee3c9d21523

**MultiRAG: A Knowledge-Guided Framework for Mitigating Hallucination in Multi-Source Retrieval Augmented Generation**

출처: https://openalex.org/W4413360566 · DOI: https://doi.org/10.1109/icde65448.2025.00230

Retrieval Augmented Generation (RAG) has emerged as a promising solution to address hallucination issues in Large Language Models (LLMs). However, the integration of multiple retrieval sources, while potentially more informative, introduces new challenges that can paradoxically exacerbate hallucination problems. These challenges manifest primarily in two aspects: the sparse distribution of multi-source data that hinders the capture of logical relationships and the inherent inconsistencies among different sources that lead to information conflicts. To address these challenges, we propose MultiRAG, a novel framework designed to mitigate hallucination in multi-source retrieval-augmented generation through knowledge-guided approaches. Our framework introduces two key innovations: (1) a knowledge construction module that employs multi-source line graphs to efficiently aggregate logical relationships across different knowledge sources, effectively addressing the sparse data distribution issue; and (2) a sophisticated retrieval module that implements a multi-level confidence calculation mechanism, performing both graph-level and node-level assessments to identify and eliminate unreliable information nodes, thereby reducing hallucinations caused by inter-source inconsistencies. Extensive experiments on four multi-domain query datasets and two multi-hop QA datasets demonstrate that MultiRAG significantly enhances the reliability and efficiency of knowledge retrieval in complex multi-source scenarios. Our code is available in https://github.com/wuwenlong123/MultiRAG.

## R21a5dc1e3f77

**RAGTruth: A Hallucination Corpus for Developing Trustworthy Retrieval-Augmented Language Models**

출처: https://openalex.org/W4402671555 · DOI: https://doi.org/10.18653/v1/2024.acl-long.585

Cheng Niu, Yuanhao Wu, Juno Zhu, Siliang Xu, KaShun Shum, Randy Zhong, Juntong Song, Tong Zhang. Proceedings of the 62nd Annual Meeting of the Association for Computational Linguistics (Volume 1: Long Papers). 2024.

## Rcad9cdbf4257

**Searching for Best Practices in Retrieval-Augmented Generation**

출처: https://openalex.org/W4404782883 · DOI: https://doi.org/10.18653/v1/2024.emnlp-main.981

Xiaohua Wang, Zhenghua Wang, Xuan Gao, Feiran Zhang, Yixin Wu, Zhibo Xu, Tianyuan Shi, Zhengyuan Wang, Shizheng Li, Qi Qian, Ruicheng Yin, Changze Lv, Xiaoqing Zheng, Xuanjing Huang. Proceedings of the 2024 Conference on Empirical Methods in Natural Language Processing. 2024.

## Rf3882a5206b1

**Benchmarking Large Language Models in Retrieval-Augmented Generation**

출처: https://openalex.org/W4386556635 · DOI: https://doi.org/10.48550/arxiv.2309.01431

Retrieval-Augmented Generation (RAG) is a promising approach for mitigating the hallucination of large language models (LLMs). However, existing research lacks rigorous evaluation of the impact of retrieval-augmented generation on different large language models, which make it challenging to identify the potential bottlenecks in the capabilities of RAG for different LLMs. In this paper, we systematically investigate the impact of Retrieval-Augmented Generation on large language models. We analyze the performance of different large language models in 4 fundamental abilities required for RAG, including noise robustness, negative rejection, information integration, and counterfactual robustness. To this end, we establish Retrieval-Augmented Generation Benchmark (RGB), a new corpus for RAG evaluation in both English and Chinese. RGB divides the instances within the benchmark into 4 separate testbeds based on the aforementioned fundamental abilities required to resolve the case. Then we evaluate 6 representative LLMs on RGB to diagnose the challenges of current LLMs when applying RAG. Evaluation reveals that while LLMs exhibit a certain degree of noise robustness, they still struggle significantly in terms of negative rejection, information integration, and dealing with false information. The aforementioned assessment outcomes indicate that there is still a considerable journey ahead to effectively apply RAG to LLMs.

## Ra0d07dda60a2

**Retrieval-augmented generation for generative artificial intelligence in health care**

출처: https://openalex.org/W4406813548 · DOI: https://doi.org/10.1038/s44401-024-00004-1

Generative artificial intelligence has brought disruptive innovations in health care but faces certain challenges. Retrieval-augmented generation (RAG) enables models to generate more reliable content by leveraging the retrieval of external knowledge. In this perspective, we analyze the possible contributions that RAG could bring to health care in equity, reliability, and personalization. Additionally, we discuss the current limitations and challenges of implementing RAG in medical scenarios.

## Rb4b174b4bb85

**Automating Systematic Literature Reviews with Retrieval-Augmented Generation: A Comprehensive Overview**

출처: https://openalex.org/W4403248625 · DOI: https://doi.org/10.3390/app14199103

This study examines Retrieval-Augmented Generation (RAG) in large language models (LLMs) and their significant application for undertaking systematic literature reviews (SLRs). RAG-based LLMs can potentially automate tasks like data extraction, summarization, and trend identification. However, while LLMs are exceptionally proficient in generating human-like text and interpreting complex linguistic nuances, their dependence on static, pre-trained knowledge can result in inaccuracies and hallucinations. RAG mitigates these limitations by integrating LLMs’ generative capabilities with the precision of real-time information retrieval. We review in detail the three key processes of the RAG framework—retrieval, augmentation, and generation. We then discuss applications of RAG-based LLMs to SLR automation and highlight future research topics, including integration of domain-specific LLMs, multimodal data processing and generation, and utilization of multiple retrieval sources. We propose a framework of RAG-based LLMs for automating SRLs, which covers four stages of SLR process: literature search, literature screening, data extraction, and information synthesis. Future research aims to optimize the interaction between LLM selection, training strategies, RAG techniques, and prompt engineering to implement the proposed framework, with particular emphasis on the retrieval of information from individual scientific papers and the integration of these data to produce outputs addressing various aspects such as current status, existing gaps, and emerging trends.

## Ref0b9fccd750

**MEGA-RAG: a retrieval-augmented generation framework with multi-evidence guided answer refinement for mitigating hallucinations of LLMs in public health**

출처: https://openalex.org/W4414925442 · DOI: https://doi.org/10.3389/fpubh.2025.1635381

Introduction: The increasing adoption of large language models (LLMs) in public health has raised significant concerns about hallucinations-factually inaccurate or misleading outputs that can compromise clinical communication and policy decisions. Methods: We propose a retrieval-augmented generation framework with multi-evidence guided answer refinement (MEGA-RAG), specifically designed to mitigate hallucinations in public health applications. The framework integrates multi-source evidence retrieval (dense retrieval via FAISS, keyword-based retrieval via BM25, and biomedical knowledge graphs), employs a cross-encoder reranker to ensure semantic relevance, and incorporates a discrepancy-aware refinement module to further enhance factual accuracy. Results: Experimental evaluation demonstrates that MEGA-RAG outperforms four baseline models [PubMedBERT, PubMedGPT, standalone LLM, and LLM with standard retrieval-augmented generation (RAG)], achieving a reduction in hallucination rates by over 40%. It also achieves the highest accuracy (0.7913), precision (0.7541), recall (0.8304), and F1 score (0.7904). Discussion: These findings confirm that MEGA-RAG is highly effective in generating factually reliable and medically accurate responses, thereby enhancing the credibility of AI-generated health information for applications in health education, clinical communication, and evidence-based policy development.

## R889f0a64f1a0

**Benchmarking Retrieval-Augmented Generation for Medicine**

출처: https://openalex.org/W4402670290 · DOI: https://doi.org/10.18653/v1/2024.findings-acl.372

While large language models (LLMs) have achieved state-of-the-art performance on a wide range of medical question answering (QA) tasks, they still face challenges with hallucinations and outdated knowledge.Retrievalaugmented generation (RAG) is a promising solution and has been widely adopted.However, a RAG system can involve multiple flexible components, and there is a lack of best practices regarding the optimal RAG setting for various medical purposes.To systematically evaluate such systems, we propose the Medical Information Retrieval-Augmented Generation Evaluation (MIRAGE), a first-of-its-kind benchmark including 7,663 questions from five medical QA datasets.Using MIRAGE, we conducted large-scale experiments with over 1.8 trillion prompt tokens on 41 combinations of different corpora, retrievers, and backbone LLMs through the MEDRAG toolkit introduced in this work.Overall, MEDRAG improves the accuracy of six different LLMs by up to 18% over chain-of-thought prompting, elevating the performance of GPT-3.5 and Mixtral to GPT-4level.Our results show that the combination of various medical corpora and retrievers achieves the best performance.In addition, we discovered a log-linear scaling property and the "lostin-the-middle" effects in medical RAG.We believe our comprehensive evaluations can serve as practical guidelines for implementing RAG systems for medicine 1 .

## R0480ef2054c9

**ReRag: A New Architecture for Reducing the Hallucination by Retrieval- Augmented Generation**

출처: https://openalex.org/W4405272436 · DOI: https://doi.org/10.1109/ubmk63289.2024.10773428

As the application areas of Generative AI models become widespread, new problems arise. One of these problems is the “hallucination” observed in Large Language Models (LLM). Recently, Retrieval-Augmented Generation systems (RAG) have been introduced to cope with this problem. In this paper, we propose a new method, called “ReRag for Retrieval Augmented Generation”, to reduce the hallucination effect of LLM responses. This method assumes that a small dataset of queries and their man-made ideal responses are available for a specific application domain. It attempts to optimize the hyperparameters of the vector database in the RAG system by generating close-to-ideal responses concerning this ideal dataset, in which the questions and the ideal answers are provided. ReRag measures the similarity between the generated and ideal responses and then modifies the hyperparameters iteratively to increase the similarity between these two responses. Experimental results show that the ReRag method reduces the hallucination problem and generates relatively close to ideal responses compared to raw models.

## Rae07ede2ffdb

**Accelerating Retrieval-Augmented Generation**

출처: https://openalex.org/W4407197060 · DOI: https://doi.org/10.1145/3669940.3707264

An evolving solution to address hallucination and enhance accuracy in large language models (LLMs) is Retrieval-Augmented Generation (RAG), which involves augmenting LLMs with information retrieved from an external knowledge source, such as the web. This paper profiles several RAG execution pipelines and demystifies the complex interplay between their retrieval and generation phases. We demonstrate that while exact retrieval schemes are expensive, they can reduce inference time compared to approximate retrieval variants because an exact retrieval model can send a smaller but more accurate list of documents to the generative model while maintaining the same end-to-end accuracy. This observation motivates the acceleration of the exact nearest neighbor search for RAG.

## R1bec2c78e257

**Reducing hallucination in structured outputs via Retrieval-Augmented Generation**

출처: https://openalex.org/W4394838812 · DOI: https://doi.org/10.48550/arxiv.2404.08189

A common and fundamental limitation of Generative AI (GenAI) is its propensity to hallucinate. While large language models (LLM) have taken the world by storm, without eliminating or at least reducing hallucinations, real-world GenAI systems may face challenges in user adoption. In the process of deploying an enterprise application that produces workflows based on natural language requirements, we devised a system leveraging Retrieval Augmented Generation (RAG) to greatly improve the quality of the structured output that represents such workflows. Thanks to our implementation of RAG, our proposed system significantly reduces hallucinations in the output and improves the generalization of our LLM in out-of-domain settings. In addition, we show that using a small, well-trained retriever encoder can reduce the size of the accompanying LLM, thereby making deployments of LLM-based systems less resource-intensive.

## Ra673eef77727

**Query Rewriting in Retrieval-Augmented Large Language Models**

출처: https://openalex.org/W4389518671 · DOI: https://doi.org/10.18653/v1/2023.emnlp-main.322

Large Language Models (LLMs) play powerful, black-box readers in the retrieve-thenread pipeline, making remarkable progress in knowledge-intensive tasks.This work introduces a new framework, Rewrite-Retrieve-Read instead of the previous retrieve-then-read for the retrieval-augmented LLMs from the perspective of the query rewriting.Unlike prior studies focusing on adapting either the retriever or the reader, our approach pays attention to the adaptation of the search query itself, for there is inevitably a gap between the input text and the needed knowledge in retrieval.We first prompt an LLM to generate the query, then use a web search engine to retrieve contexts.Furthermore, to better align the query to the frozen modules, we propose a trainable scheme for our pipeline.A small language model is adopted as a trainable rewriter to cater to the black-box LLM reader.The rewriter is trained using the feedback of the LLM reader by reinforcement learning.Evaluation is conducted on downstream tasks, open-domain QA and multiple-choice QA.Experiments results show consistent performance improvement, indicating that our framework is proven effective and scalable, and brings a new framework for retrieval-augmented LLM 1 .

## Re4f836632941

**Integrating Retrieval-Augmented Generation with Large Language Models in Nephrology: Advancing Practical Applications**

출처: https://openalex.org/W4392597393 · DOI: https://doi.org/10.3390/medicina60030445

The integration of large language models (LLMs) into healthcare, particularly in nephrology, represents a significant advancement in applying advanced technology to patient care, medical research, and education. These advanced models have progressed from simple text processors to tools capable of deep language understanding, offering innovative ways to handle health-related data, thus improving medical practice efficiency and effectiveness. A significant challenge in medical applications of LLMs is their imperfect accuracy and/or tendency to produce hallucinations-outputs that are factually incorrect or irrelevant. This issue is particularly critical in healthcare, where precision is essential, as inaccuracies can undermine the reliability of these models in crucial decision-making processes. To overcome these challenges, various strategies have been developed. One such strategy is prompt engineering, like the chain-of-thought approach, which directs LLMs towards more accurate responses by breaking down the problem into intermediate steps or reasoning sequences. Another one is the retrieval-augmented generation (RAG) strategy, which helps address hallucinations by integrating external data, enhancing output accuracy and relevance. Hence, RAG is favored for tasks requiring up-to-date, comprehensive information, such as in clinical decision making or educational applications. In this article, we showcase the creation of a specialized ChatGPT model integrated with a RAG system, tailored to align with the KDIGO 2023 guidelines for chronic kidney disease. This example demonstrates its potential in providing specialized, accurate medical advice, marking a step towards more reliable and efficient nephrology practices.

## Ra3091c0d45c0

**Corrective Retrieval Augmented Generation**

출처: https://openalex.org/W4410705984 · DOI: https://doi.org/10.2139/ssrn.5267341

초록 없음. 제목만으로 확인할 수 없는 조건은 UNKNOWN으로 판정합니다.

## Ra2ef40c33476

**Hallucination Mitigation for Retrieval-Augmented Large Language Models: A Review**

출처: https://openalex.org/W4408145721 · DOI: https://doi.org/10.3390/math13050856

Retrieval-augmented generation (RAG) leverages the strengths of information retrieval and generative models to enhance the handling of real-time and domain-specific knowledge. Despite its advantages, limitations within RAG components may cause hallucinations, or more precisely termed confabulations in generated outputs, driving extensive research to address these limitations and mitigate hallucinations. This review focuses on hallucination in retrieval-augmented large language models (LLMs). We first examine the causes of hallucinations from different sub-tasks in the retrieval and generation phases. Then, we provide a comprehensive overview of corresponding hallucination mitigation techniques, offering a targeted and complete framework for addressing hallucinations in retrieval-augmented LLMs. We also investigate methods to reduce the impact of hallucination through detection and correction. Finally, we discuss promising future research directions for mitigating hallucinations in retrieval-augmented LLMs.

## R97496c66e92d

**Hyper-RAG: combating LLM hallucinations using hypergraph-driven retrieval-augmented generation**

출처: https://openalex.org/W4409287760 · DOI: https://doi.org/10.1038/s41467-026-71411-1

Large language models (LLMs) have transformed various sectors, including education, finance, and medicine, by enhancing content generation and decision-making processes. However, their integration into the medical field is cautious due to hallucinations, instances where generated content deviates from factual accuracy, potentially leading to adverse outcomes. To address this, we introduce Hyper-RAG, a hypergraph-driven Retrieval-Augmented Generation method that comprehensively captures both pairwise and beyond-pairwise correlations in domain-specific knowledge, thereby mitigating hallucinations. Experiments on the NeurologyCrop dataset with six prominent LLMs demonstrated that Hyper-RAG improves accuracy by an average of 12.3% over direct LLM use and outperforms GraphRAG and LightRAG by 6.3% and 6.0%, respectively. Additionally, Hyper-RAG maintained stable performance with increasing query complexity, unlike existing methods which declined. Further validation across nine diverse datasets showed a 35.5% performance improvement over LightRAG using a selection-based assessment. The lightweight variant, Hyper-RAG-Lite, achieved twice the retrieval speed and a 3.3% performance boost compared with LightRAG. These results confirm Hyper-RAG's effectiveness in enhancing LLM reliability and reducing hallucinations, making it a robust solution for high-stakes applications like medical diagnostics.

## R1c015b2c2315

**Retrieval-Augmented Generation and Hallucination in Large Language Models: A Scholarly Overview**

출처: https://openalex.org/W4411065983 · DOI: https://doi.org/10.36347/sjet.2025.v13i05.003

Large Language Models (LLMs) have revolutionized natural language processing tasks, yet they often suffer from "hallucination” the confident generation of factually incorrect information. Retrieval-Augmented Generation (RAG) has emerged as a promising technique to mitigate hallucinations by grounding model responses in external documents. This article explores the underlying causes of hallucinations in LLMs, the mechanisms and architectures of RAG systems, their effectiveness in reducing hallucinations, and ongoing challenges. We conclude with a discussion of future directions for integrating retrieval mechanisms more seamlessly into generative architecture.

## R21c359d6ac9c

**Retrieval-augmented generation for educational application: A systematic survey**

출처: https://openalex.org/W4410362031 · DOI: https://doi.org/10.1016/j.caeai.2025.100417

Advancements in large language models (LLMs) have transformed AI-driven education, enabling innovative applications across various learning and teaching domains. However, LLMs still face several challenges, including hallucination and static internal knowledge, which hinder their reliability in educational settings. Retrieval-Augmented Generation (RAG) enhances LLMs by retrieving relevant information from an external knowledge base and incorporating it into the LLM's generation process. This approach improves factual accuracy and enables dynamic knowledge updates, making LLMs particularly suitable for educational applications. In this paper, we comprehensively review existing research that integrates RAG into educational scenarios. We first clarify the definition and workflow of RAG, and following the indexing mechanism of RAG, we introduce different types of retrievers and generation optimization methods. As the main focus of this work, we explore the practical applications of RAG in education, covering interactive learning systems, generation and assessment of educational content, and large-scale deployment in educational ecosystems. Based on our comprehensive review, this paper discusses existing challenges and future directions, including mitigating hallucinations, ensuring the completeness and timeliness of retrieved knowledge, reducing computational costs, and enhancing multimodal support for RAG-based educational applications.

## R10a278326935

**Enhancing Retrieval-Augmented Large Language Models with Iterative Retrieval-Generation Synergy**

출처: https://openalex.org/W4389520468 · DOI: https://doi.org/10.18653/v1/2023.findings-emnlp.620

Retrieval-augmented generation has raise extensive attention as it is promising to address the limitations of large language models including outdated knowledge and hallucinations.However, retrievers struggle to capture relevance, especially for queries with complex information needs.Recent work has proposed to improve relevance modeling by having large language models actively involved in retrieval, i.e., to guide retrieval with generation.In this paper, we show that strong performance can be achieved by a method we call ITER-RETGEN, which synergizes retrieval and generation in an iterative manner: a model's response to a task input shows what might be needed to finish the task, and thus can serve as an informative context for retrieving more relevant knowledge which in turn helps generate a better response in another iteration.Compared with recent work which interleaves retrieval with generation when completing a single output, ITER-RETGEN processes all retrieved knowledge as a whole and largely preserves the flexibility in generation without structural constraints.We evaluate ITER-RETGEN on multi-hop question answering, fact verification, and commonsense reasoning, and show that it can flexibly leverage parametric knowledge and non-parametric knowledge, and is superior to or competitive with state-of-the-art retrieval-augmented baselines while causing fewer overheads of retrieval and generation.We can further improve performance via generation-augmented retrieval adaptation.

## Ra7c8388bcb17

**A Survey on RAG Meeting LLMs: Towards Retrieval-Augmented Large Language Models**

출처: https://openalex.org/W4401857375 · DOI: https://doi.org/10.1145/3637528.3671470

As one of the most advanced techniques in AI, Retrieval-Augmented Generation (RAG) can offer reliable and up-to-date external knowledge, providing huge convenience for numerous tasks. Particularly in the era of AI-Generated Content (AIGC), the powerful capacity of retrieval in providing additional knowledge enables RAG to assist existing generative AI in producing high-quality outputs. Recently, Large Language Models (LLMs) have demonstrated revolutionary abilities in language understanding and generation, while still facing inherent limitations such as hallucinations and out-of-date internal knowledge. Given the powerful abilities of RAG in providing the latest and helpful auxiliary information, Retrieval-Augmented Large Language Models (RA-LLMs) have emerged to harness external and authoritative knowledge bases, rather than solely relying on the model's internal knowledge, to augment the quality of the generated content of LLMs. In this survey, we comprehensively review existing research studies in RA-LLMs, covering three primary technical perspectives: Furthermore, to deliver deeper insights, we discuss current limitations and several promising directions for future research. Updated information about this survey can be found at: https://advanced-recommender-systems.github.io/RAG-Meets-LLMs/

## R6919ffdc1be7

**Active Retrieval Augmented Generation**

출처: https://openalex.org/W4389519118 · DOI: https://doi.org/10.18653/v1/2023.emnlp-main.495

Zhengbao Jiang, Frank Xu, Luyu Gao, Zhiqing Sun, Qian Liu, Jane Dwivedi-Yu, Yiming Yang, Jamie Callan, Graham Neubig. Proceedings of the 2023 Conference on Empirical Methods in Natural Language Processing. 2023.

## R5ffa75cb0ef8

**Hallucination‐Free? Assessing the Reliability of Leading AI Legal Research Tools**

출처: https://openalex.org/W4409716856 · DOI: https://doi.org/10.1111/jels.12413

ABSTRACT Legal practice has witnessed a sharp rise in products incorporating artificial intelligence (AI). Such tools are designed to assist with a wide range of core legal tasks, from search and summarization of caselaw to document drafting. However, the large language models used in these tools are prone to “hallucinate,” or make up false information, making their use risky in high‐stakes domains. Recently, certain legal research providers have touted methods such as retrieval‐augmented generation (RAG) as “eliminating” or “avoid[ing]” hallucinations, or guaranteeing “hallucination‐free” legal citations. Because of the closed nature of these systems, systematically assessing these claims is challenging. In this article, we design and report on the first preregistered empirical evaluation of AI‐driven legal research tools. We demonstrate that the providers' claims are overstated. While hallucinations are reduced relative to general‐purpose chatbots (GPT‐4), we find that the AI research tools made by LexisNexis (Lexis+ AI) and Thomson Reuters (Westlaw AI‐Assisted Research and Ask Practical Law AI) each hallucinate between 17% and 33% of the time. We also document substantial differences between systems in responsiveness and accuracy. Our article makes four key contributions. It is the first to assess and report the performance of RAG‐based proprietary legal AI tools. Second, it introduces a comprehensive, preregistered dataset for identifying and understanding vulnerabilities in these systems. Third, it proposes a clear typology for differentiating between hallucinations and accurate legal responses. Last, it provides evidence to inform the responsibilities of legal professionals in supervising and verifying AI outputs, which remains a central open question for the responsible integration of AI into law.

## R4b26c435a0fe

**Optimization of hepatological clinical guidelines interpretation by large language models: a retrieval augmented generation-based framework**

출처: https://openalex.org/W4395050972 · DOI: https://doi.org/10.1038/s41746-024-01091-y

Large language models (LLMs) can potentially transform healthcare, particularly in providing the right information to the right provider at the right time in the hospital workflow. This study investigates the integration of LLMs into healthcare, specifically focusing on improving clinical decision support systems (CDSSs) through accurate interpretation of medical guidelines for chronic Hepatitis C Virus infection management. Utilizing OpenAI's GPT-4 Turbo model, we developed a customized LLM framework that incorporates retrieval augmented generation (RAG) and prompt engineering. Our framework involved guideline conversion into the best-structured format that can be efficiently processed by LLMs to provide the most accurate output. An ablation study was conducted to evaluate the impact of different formatting and learning strategies on the LLM's answer generation accuracy. The baseline GPT-4 Turbo model's performance was compared against five experimental setups with increasing levels of complexity: inclusion of in-context guidelines, guideline reformatting, and implementation of few-shot learning. Our primary outcome was the qualitative assessment of accuracy based on expert review, while secondary outcomes included the quantitative measurement of similarity of LLM-generated responses to expert-provided answers using text-similarity scores. The results showed a significant improvement in accuracy from 43 to 99% (p < 0.001), when guidelines were provided as context in a coherent corpus of text and non-text sources were converted into text. In addition, few-shot learning did not seem to improve overall accuracy. The study highlights that structured guideline reformatting and advanced prompt engineering (data quality vs. data quantity) can enhance the efficacy of LLM integrations to CDSSs for guideline delivery.

## Rafec338b63de

**Generation-Augmented Retrieval for Open-Domain Question Answering**

출처: https://openalex.org/W3176182290 · DOI: https://doi.org/10.18653/v1/2021.acl-long.316

Yuning Mao, Pengcheng He, Xiaodong Liu, Yelong Shen, Jianfeng Gao, Jiawei Han, Weizhu Chen. Proceedings of the 59th Annual Meeting of the Association for Computational Linguistics and the 11th International Joint Conference on Natural Language Processing (Volume 1: Long Papers). 2021.

## R793a13404957

**Lrp4rag: Detecting Hallucinations in Retrieval-Augmented Generation Via Layer-Wise Relevance Propagation**

출처: https://openalex.org/W4409352943 · DOI: https://doi.org/10.2139/ssrn.5199254

초록 없음. 제목만으로 확인할 수 없는 조건은 UNKNOWN으로 판정합니다.

## Rd399d21902c3

**ReDeEP: Detecting Hallucination in Retrieval-Augmented Generation via Mechanistic Interpretability**

출처: https://openalex.org/W4403574069 · DOI: https://doi.org/10.48550/arxiv.2410.11414

Retrieval-Augmented Generation (RAG) models are designed to incorporate external knowledge, reducing hallucinations caused by insufficient parametric (internal) knowledge. However, even with accurate and relevant retrieved content, RAG models can still produce hallucinations by generating outputs that conflict with the retrieved information. Detecting such hallucinations requires disentangling how Large Language Models (LLMs) utilize external and parametric knowledge. Current detection methods often focus on one of these mechanisms or without decoupling their intertwined effects, making accurate detection difficult. In this paper, we investigate the internal mechanisms behind hallucinations in RAG scenarios. We discover hallucinations occur when the Knowledge FFNs in LLMs overemphasize parametric knowledge in the residual stream, while Copying Heads fail to effectively retain or integrate external knowledge from retrieved content. Based on these findings, we propose ReDeEP, a novel method that detects hallucinations by decoupling LLM's utilization of external context and parametric knowledge. Our experiments show that ReDeEP significantly improves RAG hallucination detection accuracy. Additionally, we introduce AARF, which mitigates hallucinations by modulating the contributions of Knowledge FFNs and Copying Heads.

## R73dd99f7ac92

**Benchmarking Large Language Models in Retrieval-Augmented Generation**

출처: https://openalex.org/W4393147129 · DOI: https://doi.org/10.1609/aaai.v38i16.29728

Retrieval-Augmented Generation (RAG) is a promising approach for mitigating the hallucination of large language models (LLMs). However, existing research lacks rigorous evaluation of the impact of retrieval-augmented generation on different large language models, which make it challenging to identify the potential bottlenecks in the capabilities of RAG for different LLMs. In this paper, we systematically investigate the impact of Retrieval-Augmented Generation on large language models. We analyze the performance of different large language models in 4 fundamental abilities required for RAG, including noise robustness, negative rejection, information integration, and counterfactual robustness. To this end, we establish Retrieval-Augmented Generation Benchmark (RGB), a new corpus for RAG evaluation in both English and Chinese. RGB divides the instances within the benchmark into 4 separate testbeds based on the aforementioned fundamental abilities required to resolve the case. Then we evaluate 6 representative LLMs on RGB to diagnose the challenges of current LLMs when applying RAG. Evaluation reveals that while LLMs exhibit a certain degree of noise robustness, they still struggle significantly in terms of negative rejection, information integration, and dealing with false information. The aforementioned assessment outcomes indicate that there is still a considerable journey ahead to effectively apply RAG to LLMs.

## Rc10c2ffd5f0f

**A Comprehensive Survey of Hallucination Mitigation Techniques in Large Language Models**

출처: https://openalex.org/W4390602555 · DOI: https://doi.org/10.48550/arxiv.2401.01313

As Large Language Models (LLMs) continue to advance in their ability to write human-like text, a key challenge remains around their tendency to hallucinate generating content that appears factual but is ungrounded. This issue of hallucination is arguably the biggest hindrance to safely deploying these powerful LLMs into real-world production systems that impact people's lives. The journey toward widespread adoption of LLMs in practical settings heavily relies on addressing and mitigating hallucinations. Unlike traditional AI systems focused on limited tasks, LLMs have been exposed to vast amounts of online text data during training. While this allows them to display impressive language fluency, it also means they are capable of extrapolating information from the biases in training data, misinterpreting ambiguous prompts, or modifying the information to align superficially with the input. This becomes hugely alarming when we rely on language generation capabilities for sensitive applications, such as summarizing medical records, financial analysis reports, etc. This paper presents a comprehensive survey of over 32 techniques developed to mitigate hallucination in LLMs. Notable among these are Retrieval Augmented Generation (Lewis et al, 2021), Knowledge Retrieval (Varshney et al,2023), CoNLI (Lei et al, 2023), and CoVe (Dhuliawala et al, 2023). Furthermore, we introduce a detailed taxonomy categorizing these methods based on various parameters, such as dataset utilization, common tasks, feedback mechanisms, and retriever types. This classification helps distinguish the diverse approaches specifically designed to tackle hallucination issues in LLMs. Additionally, we analyze the challenges and limitations inherent in these techniques, providing a solid foundation for future research in addressing hallucinations and related phenomena within the realm of LLMs.

## R74882c6030ab

**Enhancing Large Language Model Reliability: Minimizing Hallucinations with Dual Retrieval-Augmented Generation Based on the Latest Diabetes Guidelines**

출처: https://openalex.org/W4404927183 · DOI: https://doi.org/10.3390/jpm14121131

Background/Objectives: Large language models (LLMs) show promise in healthcare but face challenges with hallucinations, particularly in rapidly evolving fields like diabetes management. Traditional LLM updating methods are resource-intensive, necessitating new approaches for delivering reliable, current medical information. This study aimed to develop and evaluate a novel retrieval system to enhance LLM reliability in diabetes management across different languages and guidelines. Methods: We developed a dual retrieval-augmented generation (RAG) system integrating both Korean Diabetes Association and American Diabetes Association 2023 guidelines. The system employed dense retrieval with 11 embedding models (including OpenAI, Upstage, and multilingual models) and sparse retrieval using BM25 algorithm with language-specific tokenizers. Performance was evaluated across different top-k values, leading to optimized ensemble retrievers for each guideline. Results: For dense retrievers, Upstage’s Solar Embedding-1-large and OpenAI’s text-embedding-3-large showed superior performance for Korean and English guidelines, respectively. Multilingual models outperformed language-specific models in both cases. For sparse retrievers, the ko_kiwi tokenizer demonstrated superior performance for Korean text, while both ko_kiwi and porter_stemmer showed comparable effectiveness for English text. The ensemble retrievers, combining optimal dense and sparse configurations, demonstrated enhanced coverage while maintaining precision. Conclusions: This study presents an effective dual RAG system that enhances LLM reliability in diabetes management across different languages. The successful implementation with both Korean and American guidelines demonstrates the system’s cross-regional capability, laying a foundation for more trustworthy AI-assisted healthcare applications.

## R2f22e3ba771e

**Retrieval Augmentation Reduces Hallucination in Conversation**

출처: https://openalex.org/W3155807546 · DOI: https://doi.org/10.18653/v1/2021.findings-emnlp.320

Despite showing increasingly human-like conversational abilities, state-of-the-art dialogue models often suffer from factual incorrectness and hallucination of knowledge (Roller et al., 2021).In this work we explore the use of neural-retrieval-in-the-loop architectures -recently shown to be effective in open-domain QA (Lewis et al., 2020b; Izacard and Grave, 2021b) -for knowledge-grounded dialogue, a task that is arguably more challenging as it requires querying based on complex multi-turn dialogue context and generating conversationally coherent responses.We study various types of architectures with multiple components -retrievers, rankers, and encoder-decoders -with the goal of maximizing knowledgeability while retaining conversational ability.We demonstrate that our best models obtain state-of-the-art performance on two knowledge-grounded conversational tasks.The models exhibit open-domain conversational capabilities, generalize effectively to scenarios not within the training data, and, as verified by human evaluations, substantially reduce the well-known problem of knowledge hallucination in state-of-the-art chatbots. * Equal ContributionThe following is a conversation with an AI assistant.The assistant is helpful, creative, clever, and very friendly.Human: Hello, who are you?AI: I am an AI created by OpenAI.How can I help you today?Human: Tell me about Kyunghyun

## R0d5b57194e54

**Graph Retrieval-Augmented Generation: A Survey**

출처: https://openalex.org/W4416379250 · DOI: https://doi.org/10.1145/3777378

Recently, Retrieval-Augmented Generation (RAG) has achieved remarkable success in addressing the challenges of Large Language Models (LLMs) without necessitating retraining. By referencing an external knowledge base, RAG refines LLM outputs, effectively mitigating issues such as “hallucination,” lack of domain-specific knowledge, and outdated information. However, the complex structure of relationships among different entities in databases presents challenges for RAG systems. In response, GraphRAG leverages structural information across entities to enable more precise and comprehensive retrieval, capturing relational knowledge and facilitating more accurate, context-aware responses. Given the novelty and potential of GraphRAG, a systematic review of current technologies is imperative. This article provides the first comprehensive overview of GraphRAG methodologies. We formalize the GraphRAG workflow, encompassing Graph-Based Indexing, Graph-Guided Retrieval, and Graph-Enhanced Generation. We then outline the core technologies and training methods at each stage. Additionally, we examine downstream tasks, application domains, evaluation methodologies, and industrial use cases of GraphRAG. Finally, we explore future research directions to inspire further inquiries and advance progress in the field. In order to track recent progress, we set up a repository at https://github.com/pengboci/GraphRAG-Survey .

## R124d208a2502

**Enhancing medical AI with retrieval-augmented generation: A mini narrative review**

출처: https://openalex.org/W4409690035 · DOI: https://doi.org/10.1177/20552076251337177

Retrieval-augmented generation (RAG) is a powerful technique in artificial intelligence (AI) and machine learning that enhances the capabilities of large language models (LLMs) by integrating external data sources, allowing for more accurate, contextually relevant responses. In medical applications, RAG has the potential to improve diagnostic accuracy, clinical decision support, and patient care. This narrative review explores the application of RAG across various medical domains, including guideline interpretation, diagnostic assistance, clinical trial eligibility screening, clinical information retrieval, and information extraction from scientific literature. Studies highlight the benefits of RAG in providing accurate, up-to-date information, improving clinical outcomes, and streamlining processes. Notable applications include GPT-4 models enhanced with RAG to interpret hepatologic guidelines, assist in differential diagnosis, and aid in clinical trial screening. Furthermore, RAG-based systems have demonstrated superior performance over traditional methods in tasks such as patient diagnosis, clinical decision-making, and medical information extraction. Despite its advantages, challenges remain, particularly in model evaluation, cost-efficiency, and reducing AI hallucinations. This review emphasizes the potential of RAG in advancing medical AI applications and advocates for further optimization of retrieval mechanisms, embedding models, and collaboration between AI researchers and healthcare professionals to maximize RAG's impact on medical practice.

## Ree49c4918f4f

**RAGAs: Automated Evaluation of Retrieval Augmented Generation**

출처: https://openalex.org/W4411630045 · DOI: https://doi.org/10.18653/v1/2024.eacl-demo.16

Shahul Es, Jithin James, Luis Espinosa Anke, Steven Schockaert. Proceedings of the 18th Conference of the European Chapter of the Association for Computational Linguistics: System Demonstrations. 2024.

## Rb25d2e9013fd

**ARES: An Automated Evaluation Framework for Retrieval-Augmented Generation Systems**

출처: https://openalex.org/W4401042808 · DOI: https://doi.org/10.18653/v1/2024.naacl-long.20

Jon Saad-Falcon, Omar Khattab, Christopher Potts, Matei Zaharia. Proceedings of the 2024 Conference of the North American Chapter of the Association for Computational Linguistics: Human Language Technologies (Volume 1: Long Papers). 2024.

## R896333c221de

**Rowen: Adaptive Retrieval-Augmented Generation for Hallucination Mitigation in LLMs**

출처: https://openalex.org/W4391941943 · DOI: https://doi.org/10.48550/arxiv.2402.10612

Hallucinations present a significant challenge for large language models (LLMs). The utilization of parametric knowledge in generating factual content is constrained by the limited knowledge of LLMs, potentially resulting in internal hallucinations. While incorporating external information can help fill knowledge gaps, it also introduces the risk of irrelevant information, thereby increasing the likelihood of external hallucinations. To balance the use of parametric knowledge within LLMs and external information, in this study, we present Rowen, a novel framework that enhances LLMs with an adaptive retrieval augmentation process tailored to address hallucinated outputs. Rowen introduces a consistency-based hallucination detection module, which assesses the model's uncertainty regarding the input query by evaluating the semantic inconsistencies in various responses generated across different languages or models. When high uncertainties in the responses are detected, Rowen activates the retrieval of external information to rectify the model outputs. Through comprehensive empirical experiments, we demonstrate that Rowen surpasses the current state-of-the-art in both detecting and mitigating hallucinated content within the outputs of LLMs.

## R6008c2573ac3

**Retrieval-Augmented Generation (RAG) Chatbots for Education: A Survey of Applications**

출처: https://openalex.org/W4409348640 · DOI: https://doi.org/10.3390/app15084234

Retrieval-Augmented Generation (RAG) overcomes the main barrier for the adoption of LLM-based chatbots in education: hallucinations. The uncomplicated architecture of RAG chatbots makes it relatively easy to implement chatbots that serve specific purposes and thus are capable of addressing various needs in the educational domain. With five years having passed since the introduction of RAG, the time has come to check the progress attained in its adoption in education. This paper identifies 47 papers dedicated to RAG chatbots’ uses for various kinds of educational purposes, which are analyzed in terms of their character, the target of the support provided by the chatbots, the thematic scope of the knowledge accessible via the chatbots, the underlying large language model, and the character of their evaluation.

## R37641824d1d1

**Seven Failure Points When Engineering a Retrieval Augmented Generation System**

출처: https://openalex.org/W4399530612 · DOI: https://doi.org/10.1145/3644815.3644945

Software engineers are increasingly adding semantic search capabilities to applications using a strategy known as Retrieval Augmented Generation (RAG). A RAG system involves finding documents that semantically match a query and then passing the documents to a large language model (LLM) such as ChatGPT to extract the right answer using an LLM. RAG systems aim to: a) reduce the problem of hallucinated responses from LLMs, b) link sources/references to generated responses, and c) remove the need for annotating documents with meta-data. However, RAG systems suffer from limitations inherent to information retrieval systems and from reliance on LLMs. In this paper, we present an experience report on the failure points of RAG systems from three case studies from separate domains: research, education, and biomedical. We share the lessons learned and present 7 failure points to consider when designing a RAG system. The two key takeaways arising from our work are: 1) validation of a RAG system is only feasible during operation, and 2) the robustness of a RAG system evolves rather than designed in at the start. We conclude with a list of potential research directions on RAG systems for the software engineering community.

## R9c222c77e455

**Evaluating Retrieval-Augmented Generation Variants for Clinical Decision Support: Hallucination Mitigation and Secure On-Premises Deployment**

출처: https://openalex.org/W4415680272 · DOI: https://doi.org/10.3390/electronics14214227

For clinical decision support to work, medical knowledge needs to be easy to find quickly and accurately. Retrieval-Augmented Generation (RAG) systems use big language models and document retrieval to help with diagnostic reasoning, but they could cause hallucinations and have strict privacy rules in healthcare. We tested twelve different types of RAG, such as dense, sparse, hybrid, graph-based, multimodal, self-reflective, adaptive, and security-focused pipelines, on 250 de-identified patient vignettes. We used Precision@5, Mean Reciprocal Rank, nDCG@10, hallucination rate, and latency to see how well the system worked. The best retrieval accuracy (P@5 ≥ 0.68, nDCG@10 ≥ 0.67) was achieved by a Haystack pipeline (DPR + BM25 + cross-encoder) and hybrid fusion (RRF). Self-reflective RAG, on the other hand, lowered hallucinations to 5.8%. Sparse retrieval gave the fastest response (120 ms), but it was not as accurate. We also suggest a single framework for reducing hallucinations that includes retrieval confidence thresholds, chain-of-thought verification, and outside fact-checking. Our findings emphasize pragmatic protocols for the secure implementation of RAG on premises, incorporating encryption, provenance tagging, and audit trails. Future directions encompass the incorporation of clinician feedback and the expansion of multimodal inputs to genomics and proteomics for precision medicine.

## R5c2d9c0f1c5b

**Almanac — Retrieval-Augmented Language Models for Clinical Medicine**

출처: https://openalex.org/W4391221150 · DOI: https://doi.org/10.1056/aioa2300068

BACKGROUND: Large language models (LLMs) have recently shown impressive zero-shot capabilities, whereby they can use auxiliary data, without the availability of task-specific training examples, to complete a variety of natural language tasks, such as summarization, dialogue generation, and question answering. However, despite many promising applications of LLMs in clinical medicine, adoption of these models has been limited by their tendency to generate incorrect and sometimes even harmful statements. METHODS: We tasked a panel of eight board-certified clinicians and two health care practitioners with evaluating Almanac, an LLM framework augmented with retrieval capabilities from curated medical resources for medical guideline and treatment recommendations. The panel compared responses from Almanac and standard LLMs (ChatGPT-4, Bing, and Bard) versus a novel data set of 314 clinical questions spanning nine medical specialties. RESULTS: Almanac showed a significant improvement in performance compared with the standard LLMs across axes of factuality, completeness, user preference, and adversarial safety. CONCLUSIONS: Our results show the potential for LLMs with access to domain-specific corpora to be effective in clinical decision-making. The findings also underscore the importance of carefully testing LLMs before deployment to mitigate their shortcomings. (Funded by the National Institutes of Health, National Heart, Lung, and Blood Institute.).

## R337147683416

**Development of a liver disease–specific large language model chat interface using retrieval-augmented generation**

출처: https://openalex.org/W4392544551 · DOI: https://doi.org/10.1097/hep.0000000000000834

BACKGROUND AND AIMS: Large language models (LLMs) have significant capabilities in clinical information processing tasks. Commercially available LLMs, however, are not optimized for clinical uses and are prone to generating hallucinatory information. Retrieval-augmented generation (RAG) is an enterprise architecture that allows the embedding of customized data into LLMs. This approach "specializes" the LLMs and is thought to reduce hallucinations. APPROACH AND RESULTS: We developed "LiVersa," a liver disease-specific LLM, by using our institution's protected health information-complaint text embedding and LLM platform, "Versa." We conducted RAG on 30 publicly available American Association for the Study of Liver Diseases guidance documents to be incorporated into LiVersa. We evaluated LiVersa's performance by conducting 2 rounds of testing. First, we compared LiVersa's outputs versus those of trainees from a previously published knowledge assessment. LiVersa answered all 10 questions correctly. Second, we asked 15 hepatologists to evaluate the outputs of 10 hepatology topic questions generated by LiVersa, OpenAI's ChatGPT 4, and Meta's Large Language Model Meta AI 2. LiVersa's outputs were more accurate but were rated less comprehensive and safe compared to those of ChatGPT 4. RESULTS: We evaluated LiVersa's performance by conducting 2 rounds of testing. First, we compared LiVersa's outputs versus those of trainees from a previously published knowledge assessment. LiVersa answered all 10 questions correctly. Second, we asked 15 hepatologists to evaluate the outputs of 10 hepatology topic questions generated by LiVersa, OpenAI's ChatGPT 4, and Meta's Large Language Model Meta AI 2. LiVersa's outputs were more accurate but were rated less comprehensive and safe compared to those of ChatGPT 4. CONCLUSIONS: In this demonstration, we built disease-specific and protected health information-compliant LLMs using RAG. While LiVersa demonstrated higher accuracy in answering questions related to hepatology, there were some deficiencies due to limitations set by the number of documents used for RAG. LiVersa will likely require further refinement before potential live deployment. The LiVersa prototype, however, is a proof of concept for utilizing RAG to customize LLMs for clinical use cases.

## R07e5aa4fa4ba

**RAG-HAT: A Hallucination-Aware Tuning Pipeline for LLM in Retrieval-Augmented Generation**

출처: https://openalex.org/W4404783652 · DOI: https://doi.org/10.18653/v1/2024.emnlp-industry.113

Retrieval-augmented generation (RAG) has emerged as a significant advancement in the field of large language models (LLMs).By integrating up-to-date information not available during their initial training, RAG greatly enhances the practical utility of LLMs in realworld applications.However, even with RAG, LLMs can still produce inaccurate outputs, such as distorting or misinterpreting source content, posing risks in high-trust scenarios.To address these issues, we introduce a novel approach called Hallucination Aware Tuning (HAT).This method involves training hallucination detection models that generate detection labels and provide detailed descriptions of the detected hallucinations.Utilizing these detection results-particularly the hallucination descriptions-GPT-4 Turbo is employed to correct any detected hallucinations.The corrected outputs, free of hallucinations, along with the original versions, are used to create a preference dataset for Direct Preference Optimization (DPO) training.The fine-tuning through DPO leads to LLMs that exhibit a reduced rate of hallucinations and deliver improved answer quality.

## Re4bcdc65ce5a

**Improving the Domain Adaptation of Retrieval Augmented Generation (RAG) Models for Open Domain Question Answering**

출처: https://openalex.org/W4317898419 · DOI: https://doi.org/10.1162/tacl_a_00530

Abstract Retrieval Augment Generation (RAG) is a recent advancement in Open-Domain Question Answering (ODQA). RAG has only been trained and explored with a Wikipedia-based external knowledge base and is not optimized for use in other specialized domains such as healthcare and news. In this paper, we evaluate the impact of joint training of the retriever and generator components of RAG for the task of domain adaptation in ODQA. We propose RAG-end2end, an extension to RAG that can adapt to a domain-specific knowledge base by updating all components of the external knowledge base during training. In addition, we introduce an auxiliary training signal to inject more domain-specific knowledge. This auxiliary signal forces RAG-end2end to reconstruct a given sentence by accessing the relevant information from the external knowledge base. Our novel contribution is that, unlike RAG, RAG-end2end does joint training of the retriever and generator for the end QA task and domain adaptation. We evaluate our approach with datasets from three domains: COVID-19, News, and Conversations, and achieve significant performance improvements compared to the original RAG model. Our work has been open-sourced through the HuggingFace Transformers library, attesting to our work’s credibility and technical consistency.

## R92021af0614f

**Applying generative AI with retrieval augmented generation to summarize and extract key clinical information from electronic health records**

출처: https://openalex.org/W4399660853 · DOI: https://doi.org/10.1016/j.jbi.2024.104662

BACKGROUND: Malnutrition is a prevalent issue in aged care facilities (RACFs), leading to adverse health outcomes. The ability to efficiently extract key clinical information from a large volume of data in electronic health records (EHR) can improve understanding about the extent of the problem and developing effective interventions. This research aimed to test the efficacy of zero-shot prompt engineering applied to generative artificial intelligence (AI) models on their own and in combination with retrieval augmented generation (RAG), for the automating tasks of summarizing both structured and unstructured data in EHR and extracting important malnutrition information. METHODOLOGY: We utilized Llama 2 13B model with zero-shot prompting. The dataset comprises unstructured and structured EHRs related to malnutrition management in 40 Australian RACFs. We employed zero-shot learning to the model alone first, then combined it with RAG to accomplish two tasks: generate structured summaries about the nutritional status of a client and extract key information about malnutrition risk factors. We utilized 25 notes in the first task and 1,399 in the second task. We evaluated the model's output of each task manually against a gold standard dataset. RESULT: The evaluation outcomes indicated that zero-shot learning applied to generative AI model is highly effective in summarizing and extracting information about nutritional status of RACFs' clients. The generated summaries provided concise and accurate representation of the original data with an overall accuracy of 93.25%. The addition of RAG improved the summarization process, leading to a 6% increase and achieving an accuracy of 99.25%. The model also proved its capability in extracting risk factors with an accuracy of 90%. However, adding RAG did not further improve accuracy in this task. Overall, the model has shown a robust performance when information was explicitly stated in the notes; however, it could encounter hallucination limitations, particularly when details were not explicitly provided. CONCLUSION: This study demonstrates the high performance and limitations of applying zero-shot learning to generative AI models to automatic generation of structured summarization of EHRs data and extracting key clinical information. The inclusion of the RAG approach improved the model performance and mitigated the hallucination problem.

## R88ca3f2d497f

**Retrieval-Augmented Generation for Large Language Models: A Survey**

출처: https://openalex.org/W4389984066 · DOI: https://doi.org/10.48550/arxiv.2312.10997

Large Language Models (LLMs) showcase impressive capabilities but encounter challenges like hallucination, outdated knowledge, and non-transparent, untraceable reasoning processes. Retrieval-Augmented Generation (RAG) has emerged as a promising solution by incorporating knowledge from external databases. This enhances the accuracy and credibility of the generation, particularly for knowledge-intensive tasks, and allows for continuous knowledge updates and integration of domain-specific information. RAG synergistically merges LLMs' intrinsic knowledge with the vast, dynamic repositories of external databases. This comprehensive review paper offers a detailed examination of the progression of RAG paradigms, encompassing the Naive RAG, the Advanced RAG, and the Modular RAG. It meticulously scrutinizes the tripartite foundation of RAG frameworks, which includes the retrieval, the generation and the augmentation techniques. The paper highlights the state-of-the-art technologies embedded in each of these critical components, providing a profound understanding of the advancements in RAG systems. Furthermore, this paper introduces up-to-date evaluation framework and benchmark. At the end, this article delineates the challenges currently faced and points out prospective avenues for research and development.

## R8fbde83d4232

**Hallucination Reduction in Large Language Models with Retrieval-Augmented Generation Using Wikipedia Knowledge**

출처: https://openalex.org/W4399154003 · DOI: https://doi.org/10.31219/osf.io/pv7r5

Natural language understanding and generation have seen great progress, yet the persistent issue of hallucination undermines the reliability of model outputs. Introducing retrieval-augmented generation (RAG) with external knowledge sources, such as Wikipedia, presents a novel and significant approach to enhancing factual accuracy and coherence in generated content. By dynamically integrating relevant information, the Mistral model demonstrates substantial improvements in precision, recall, and overall quality of responses. This research offers a robust framework for mitigating hallucinations, providing valuable insights for deploying reliable AI systems in critical applications. The comprehensive evaluation underscores the potential of RAG to advance the performance and trustworthiness of large language models.

## R142ead220016

**Retrieval augmented generation for 10 large language models and its generalizability in assessing medical fitness**

출처: https://openalex.org/W4409157497 · DOI: https://doi.org/10.1038/s41746-025-01519-z

Large Language Models (LLMs) hold promise for medical applications but often lack domain-specific expertise. Retrieval Augmented Generation (RAG) enables customization by integrating specialized knowledge. This study assessed the accuracy, consistency, and safety of LLM-RAG models in determining surgical fitness and delivering preoperative instructions using 35 local and 23 international guidelines. Ten LLMs (e.g., GPT3.5, GPT4, GPT4o, Gemini, Llama2, and Llama3, Claude) were tested across 14 clinical scenarios. A total of 3234 responses were generated and compared to 448 human-generated answers. The GPT4 LLM-RAG model with international guidelines generated answers within 20 s and achieved the highest accuracy, which was significantly better than human-generated responses (96.4% vs. 86.6%, p = 0.016). Additionally, the model exhibited an absence of hallucinations and produced more consistent output than humans. This study underscores the potential of GPT-4-based LLM-RAG models to deliver highly accurate, efficient, and consistent preoperative assessments.

## R92cff1f2f643

**Internet-Augmented Dialogue Generation**

출처: https://openalex.org/W3186138538 · DOI: https://doi.org/10.18653/v1/2022.acl-long.579

The largest store of continually updating knowledge on our planet can be accessed via internet search.In this work we study giving access to this information to conversational agents.Large language models, even though they store an impressive amount of knowledge within their weights, are known to hallucinate facts when generating dialogue (Shuster et al., 2021); moreover, those facts are frozen in time at the point of model training.In contrast, we propose an approach that learns to generate an internet search query based on the context, and then conditions on the search results to finally generate a response, a method that can employ up-to-the-minute relevant information.We train and evaluate such models on a newly collected dataset of human-human conversations whereby one of the speakers is given access to internet search during knowledge-driven discussions in order to ground their responses.We find that search-query based access of the internet in conversation provides superior performance compared to existing approaches that either use no augmentation or FAISS-based retrieval (Lewis et al., 2020b).
