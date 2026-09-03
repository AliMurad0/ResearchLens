/**
 * Mock data shaped EXACTLY like the real backend responses so that
 * swapping api.js over to real endpoints later requires no changes
 * anywhere else in the app.
 *
 * Matches:
 *   - review/schemas.py  -> ReviewResponse
 *   - papers/schemas.py  -> Paper
 *   - trends/schemas.py  -> TrendsResponse
 *   - gaps/schemas.py    -> GapResponse
 */

export const MOCK_PAPERS = [
  {
    id: "W1",
    title: "Deep Learning for Automated Detection of Diabetic Retinopathy in Fundus Photographs",
    authors: ["R. Gulshan", "L. Peng", "M. Coram"],
    year: 2023,
    venue: "JAMA Ophthalmology",
    doi: "10.1001/jamaophthalmol.2023.0142",
    cited_by_count: 842,
    abstract:
      "We trained a convolutional neural network on 128,000 retinal images graded by ophthalmologists to detect referable diabetic retinopathy. The model achieved sensitivity and specificity comparable to board-certified specialists across two validation sets, suggesting deep learning can support screening in settings without ready access to an ophthalmologist.",
  },
  {
    id: "W2",
    title: "A Comparative Study of CNN Architectures for Retinal Image Classification",
    authors: ["S. Chen", "H. Wu", "A. Nasser"],
    year: 2022,
    venue: "IEEE Transactions on Medical Imaging",
    doi: "10.1109/TMI.2022.3156721",
    cited_by_count: 311,
    abstract:
      "This work benchmarks ResNet, DenseNet, and EfficientNet backbones on five public retinopathy datasets, finding that architecture choice matters less than preprocessing consistency and class-balanced sampling for final diagnostic accuracy.",
  },
  {
    id: "W3",
    title: "Explainable AI in Ophthalmology: Grad-CAM Visualizations for Clinician Trust",
    authors: ["P. Okafor", "T. Lindqvist"],
    year: 2024,
    venue: "Nature Digital Medicine",
    doi: "10.1038/s41746-024-01029-x",
    cited_by_count: 156,
    abstract:
      "We evaluate whether saliency-map explanations increase clinician trust and diagnostic agreement with a deep learning retinopathy grader in a randomized reader study with 24 ophthalmologists, finding modest gains in trust but no significant change in diagnostic accuracy.",
  },
  {
    id: "W4",
    title: "Federated Learning for Privacy-Preserving Retinal Disease Screening Across Hospitals",
    authors: ["M. Devarakonda", "Y. Kim", "F. Alavi"],
    year: 2023,
    venue: "Lancet Digital Health",
    doi: "10.1016/S2589-7500(23)00098-4",
    cited_by_count: 203,
    abstract:
      "A federated learning framework trained across nine hospital systems without centralizing patient images, achieving accuracy within two percentage points of a centrally trained baseline while satisfying data-residency requirements in each participating region.",
  },
  {
    id: "W5",
    title: "Dataset Bias in Retinopathy Grading Models: An Audit Across Ethnicities and Camera Types",
    authors: ["A. Osei", "J. Marchetti"],
    year: 2024,
    venue: "The Lancet Digital Health",
    doi: "10.1016/S2589-7500(24)00021-6",
    cited_by_count: 98,
    abstract:
      "Auditing four widely cited retinopathy classifiers, we find sensitivity drops of up to 14 points on underrepresented ethnic groups and non-standard fundus camera manufacturers, underscoring the need for demographic and device diversity in training sets.",
  },
  {
    id: "W6",
    title: "Smartphone-Based Fundus Imaging for Diabetic Retinopathy Screening in Low-Resource Settings",
    authors: ["N. Prasad", "K. Osei-Mensah", "L. Fontaine"],
    year: 2022,
    venue: "Ophthalmology Science",
    doi: "10.1016/j.xops.2022.100164",
    cited_by_count: 267,
    abstract:
      "We deploy a low-cost smartphone adapter paired with an on-device classifier across 14 rural clinics in three countries, screening over 6,000 patients and referring 9% for specialist follow-up, at a fraction of the cost of traditional fundus cameras.",
  },
  {
    id: "W7",
    title: "Longitudinal Progression Modeling of Diabetic Retinopathy Using Sequential Fundus Images",
    authors: ["E. Sørensen", "D. Ibrahim"],
    year: 2023,
    venue: "Investigative Ophthalmology & Visual Science",
    doi: "10.1167/iovs.64.9.18",
    cited_by_count: 74,
    abstract:
      "Using recurrent architectures over multi-visit fundus sequences, we model disease progression rather than single-point classification, predicting one-year progression to sight-threatening retinopathy with an AUC of 0.87.",
  },
  {
    id: "W8",
    title: "Cost-Effectiveness of AI-Assisted versus Manual Diabetic Retinopathy Screening Programs",
    authors: ["C. Andrade", "R. Talwar", "B. Song"],
    year: 2021,
    venue: "Diabetes Care",
    doi: "10.2337/dc21-0847",
    cited_by_count: 189,
    abstract:
      "A health-economic model comparing AI-assisted triage to manual grading across a simulated national screening program estimates a 34% reduction in specialist workload with comparable downstream vision-loss outcomes over a ten-year horizon.",
  },
  {
    id: "W9",
    title: "Vision Transformers for Fine-Grained Diabetic Retinopathy Severity Grading",
    authors: ["Q. Zhang", "I. Petrov"],
    year: 2024,
    venue: "Medical Image Analysis",
    doi: "10.1016/j.media.2024.103087",
    cited_by_count: 61,
    abstract:
      "We adapt a vision transformer with patch-level attention to the five-class ICDR severity scale, outperforming CNN baselines specifically on the moderate-to-severe boundary that is most clinically consequential for referral decisions.",
  },
  {
    id: "W10",
    title: "Patient and Clinician Perspectives on Autonomous AI Diagnosis in Diabetic Eye Screening",
    authors: ["H. Bakr", "S. Whitfield"],
    year: 2023,
    venue: "Journal of Medical Internet Research",
    doi: "10.2196/44210",
    cited_by_count: 52,
    abstract:
      "Semi-structured interviews with 31 patients and 12 clinicians reveal cautious acceptance of autonomous AI diagnosis, contingent on clear referral pathways and a human clinician remaining reachable when a result is disputed.",
  },
  {
    id: "W11",
    title: "Multi-Task Learning for Joint Diabetic Retinopathy and Diabetic Macular Edema Detection",
    authors: ["G. Ferreira", "W. Lam", "N. Ahmadi"],
    year: 2022,
    venue: "Scientific Reports",
    doi: "10.1038/s41598-022-14887-3",
    cited_by_count: 133,
    abstract:
      "A shared-backbone multi-task network jointly predicting retinopathy grade and macular edema risk outperforms two independently trained single-task models on both endpoints, while halving inference cost.",
  },
  {
    id: "W12",
    title: "Regulatory Pathways for Autonomous Diagnostic AI: Lessons from Retinal Screening Approvals",
    authors: ["J. J. Abramson", "M.-L. Tran"],
    year: 2024,
    venue: "npj Digital Medicine",
    doi: "10.1038/s41746-024-01144-9",
    cited_by_count: 87,
    abstract:
      "Tracing the FDA and EU MDR approval pathways of three autonomous retinopathy diagnostic systems, this review identifies the clinical validation evidence regulators consistently required and where standards still diverge across jurisdictions.",
  },
];

export const MOCK_REVIEW_TEXT = `## Introduction

Diabetic retinopathy remains a leading cause of preventable blindness worldwide, and the gap between the number of people with diabetes and the availability of ophthalmologists to screen them has motivated over a decade of work on automated detection. Early convolutional approaches demonstrated that deep learning could match specialist-level sensitivity on curated datasets (Gulshan et al., 2023), and the field has since diversified along several distinct lines documented below.

## Model Architecture and Performance

Comparative benchmarking suggests that architecture choice matters less than commonly assumed: differences between ResNet, DenseNet, and EfficientNet backbones were modest once preprocessing and class balance were controlled for (Chen et al., 2022). More recent work has explored transformer-based approaches, with vision transformers showing a specific advantage at the moderate-to-severe grading boundary that most affects referral decisions (Zhang et al., 2024). Multi-task formulations that jointly predict retinopathy grade alongside diabetic macular edema risk have also shown gains over single-task pipelines while reducing inference cost (Ferreira et al., 2022).

## Trust, Explainability, and Clinical Adoption

A separate line of work has focused less on raw accuracy and more on whether clinicians and patients will actually adopt these systems. Saliency-based explanations modestly increased clinician trust without significantly changing diagnostic agreement in a randomized reader study (Okafor & Lindqvist, 2024), while interviews with patients and clinicians found cautious acceptance contingent on a human remaining reachable when an AI result is disputed (Bakr & Whitfield, 2023).

## Fairness and Generalizability

Perhaps the most consequential recent finding is that widely cited retinopathy classifiers show substantial sensitivity drops on underrepresented ethnic groups and non-standard camera hardware (Osei & Marchetti, 2024), directly complicating claims of specialist-level performance made on narrower training distributions. Federated learning has been proposed as a partial answer, allowing models to train across multiple hospital systems without centralizing patient images, and achieving accuracy within two points of a centrally trained baseline (Devarakonda et al., 2023).

## Deployment in Low-Resource Settings

Smartphone-based fundus imaging paired with on-device classifiers has been piloted across rural clinics in multiple countries, screening thousands of patients at a fraction of traditional camera costs (Prasad et al., 2022). Health-economic modeling of AI-assisted triage at national scale estimates meaningful reductions in specialist workload with comparable long-term vision outcomes (Andrade et al., 2021), and regulatory review of approved autonomous systems has begun to clarify what clinical validation evidence agencies consistently require (Abramson & Tran, 2024).

## Open Directions

Progression modeling over sequential visits, rather than single-point classification, remains comparatively underexplored (Sørensen & Ibrahim, 2023) and represents a promising direction distinct from the static-classification focus of most cited work above.

## Methodological Limitations Across the Literature

Several limitations recur across the studies synthesized here. Most benchmarking work, including the architecture comparisons discussed above, still evaluates on a small set of public datasets originally collected at academic medical centers, which constrains claims about generalizability even before accounting for the demographic imbalances documented by Osei and Marchetti (2024). Sample sizes for explainability and trust research remain small relative to the clinical stakes involved: the reader study underlying current Grad-CAM findings enrolled 24 ophthalmologists (Okafor & Lindqvist, 2024), and the qualitative interview work on patient acceptance drew on 31 patients and 12 clinicians (Bakr & Whitfield, 2023). Neither is unreasonable for exploratory work, but neither supports strong generalization either, and future replication at larger scale and across more clinical contexts would meaningfully strengthen the field's conclusions on trust and adoption specifically.

## Clinical and Policy Implications

Taken together, this body of work suggests a field that has largely solved the narrow technical problem it set out to solve, single-image referable-retinopathy classification, while leaving several adjacent problems only partially addressed. The health-economic case for deployment appears solid at the population level (Andrade et al., 2021), and a regulatory pathway now exists with real precedent to follow (Abramson & Tran, 2024). What remains less settled is how these systems perform and are received outside the relatively controlled conditions in which they were validated: across different camera hardware and patient populations (Osei & Marchetti, 2024), across care settings with limited connectivity (Prasad et al., 2022), and in the ongoing clinical relationship between patient, clinician, and an AI system whose judgment increasingly sits between them (Bakr & Whitfield, 2023). Closing that gap looks less like a modeling problem and more like a multi-year program of deployment research conducted alongside, not after, continued model development.`;

export const MOCK_TRENDS = {
  topic: "diabetic retinopathy deep learning",
  papers_analyzed: 48,
  year_counts: [
    { year: 2019, count: 3 },
    { year: 2020, count: 5 },
    { year: 2021, count: 7 },
    { year: 2022, count: 10 },
    { year: 2023, count: 13 },
    { year: 2024, count: 10 },
  ],
  emerging_keywords: [
    "vision transformer grading",
    "federated learning screening",
    "explainability trust",
    "progression modeling",
  ],
  saturated_keywords: [
    "convolutional neural network",
    "fundus image classification",
    "transfer learning",
  ],
  top_authors: [
    { name: "R. Gulshan", paper_count: 4 },
    { name: "S. Chen", paper_count: 3 },
    { name: "A. Osei", paper_count: 3 },
    { name: "M. Devarakonda", paper_count: 2 },
  ],
};

export const MOCK_GAPS = {
  topic: "diabetic retinopathy deep learning",
  papers_analyzed: 42,
  n_clusters: 4,
  clusters: [
    {
      cluster_id: 0,
      size: 14,
      top_terms: ["convolutional neural network", "fundus classification", "architecture"],
      avg_year: 2022.1,
      density: 0.33,
      recency: 0.41,
      sample_titles: [
        "A Comparative Study of CNN Architectures for Retinal Image Classification",
        "Vision Transformers for Fine-Grained Diabetic Retinopathy Severity Grading",
      ],
    },
    {
      cluster_id: 1,
      size: 9,
      top_terms: ["explainability", "clinician trust", "adoption"],
      avg_year: 2023.4,
      density: 0.21,
      recency: 0.68,
      sample_titles: [
        "Explainable AI in Ophthalmology: Grad-CAM Visualizations for Clinician Trust",
        "Patient and Clinician Perspectives on Autonomous AI Diagnosis",
      ],
    },
    {
      cluster_id: 2,
      size: 11,
      top_terms: ["fairness", "dataset bias", "federated learning"],
      avg_year: 2023.6,
      density: 0.26,
      recency: 0.74,
      sample_titles: [
        "Dataset Bias in Retinopathy Grading Models: An Audit Across Ethnicities and Camera Types",
        "Federated Learning for Privacy-Preserving Retinal Disease Screening",
      ],
    },
    {
      cluster_id: 3,
      size: 8,
      top_terms: ["screening program", "cost effectiveness", "regulatory approval"],
      avg_year: 2022.8,
      density: 0.19,
      recency: 0.58,
      sample_titles: [
        "Cost-Effectiveness of AI-Assisted versus Manual Diabetic Retinopathy Screening",
        "Regulatory Pathways for Autonomous Diagnostic AI",
      ],
    },
  ],
  top_gaps: [
    {
      cluster_a: 1,
      cluster_b: 3,
      cluster_a_terms: ["explainability", "clinician trust", "adoption"],
      cluster_b_terms: ["screening program", "cost effectiveness", "regulatory approval"],
      distance: 11.42,
      norm_distance: 0.91,
      gap_score: 24.6,
    },
    {
      cluster_a: 0,
      cluster_b: 2,
      cluster_a_terms: ["convolutional neural network", "fundus classification", "architecture"],
      cluster_b_terms: ["fairness", "dataset bias", "federated learning"],
      distance: 9.87,
      norm_distance: 0.74,
      gap_score: 22.1,
    },
    {
      cluster_a: 1,
      cluster_b: 2,
      cluster_a_terms: ["explainability", "clinician trust", "adoption"],
      cluster_b_terms: ["fairness", "dataset bias", "federated learning"],
      distance: 8.15,
      norm_distance: 0.58,
      gap_score: 18.9,
    },
    {
      cluster_a: 0,
      cluster_b: 3,
      cluster_a_terms: ["convolutional neural network", "fundus classification", "architecture"],
      cluster_b_terms: ["screening program", "cost effectiveness", "regulatory approval"],
      distance: 6.02,
      norm_distance: 0.33,
      gap_score: 9.4,
    },
  ],
  formula_explanation:
    "GapScore(A,B) = 100 x Density(A) x Density(B) x AvgRecency(A,B) x NormDistance(A,B). Density = cluster size / total papers analyzed. Recency = how recent the cluster's papers are on average, scaled 0-1 across this result set. NormDistance = Euclidean distance between cluster centroids in embedding space, scaled 0-1 across every cluster pair. A high score flags two well-established, currently active research clusters that remain conceptually far apart -- a candidate bridging research direction. Every step from clustering onward is classical statistics computed locally -- no LLM or external AI call is used at this stage.",
};

export function mockCompareTopics(topicA, topicB) {
  return {
    topic_a: topicA,
    topic_b: topicB,
    papers_a: 34,
    papers_b: 41,
    shared_themes: [
      "data privacy and governance constraints on model training",
      "trust and adoption barriers among domain experts",
      "evaluation gaps between benchmark performance and real-world deployment",
    ],
    distinct_to_a: [
      "regulatory approval pathways specific to diagnostic imaging devices",
      "progression modeling over sequential clinical visits",
    ],
    distinct_to_b: [
      "resource-constrained edge deployment on low-power hardware",
      "adversarial robustness under distribution shift",
    ],
    bridging_opportunity:
      "Work explicitly connecting the two topics' shared trust/adoption concerns with their respective deployment-constraint literatures is limited, despite both fields converging on near-identical stakeholder-trust findings independently.",
    overlap_score: 0.34,
  };
}
