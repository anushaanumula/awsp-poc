# Root Cause Analysis Engine for Network KPIs
# This module provides sophisticated RCA capabilities for telecom network issues

import json
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import random

class NetworkRCAEngine:
    def __init__(self):
        self.rca_rules = {
            'RRC Setup Failure Rate': {
                'thresholds': {'critical': 15, 'major': 8},
                'root_causes': {
                    'high': [
                        {
                            'cause': 'Core Network Congestion',
                            'probability': 0.35,
                            'indicators': ['High MME CPU', 'S1 congestion', 'Core latency'],
                            'next_actions': [
                                'Scale MME capacity',
                                'Optimize S1 interface',
                                'Check core connectivity',
                                'Implement load balancing'
                            ],
                            'timeline': {'resolution': '1-2 hours', 'monitoring': '48 hours'}
                        },
                        {
                            'cause': 'Radio Resource Shortage',
                            'probability': 0.25,
                            'indicators': ['High PRB utilization', 'RACH overload'],
                            'next_actions': [
                                'Add carrier capacity',
                                'Optimize RACH configuration',
                                'Implement carrier aggregation'
                            ],
                            'timeline': {'resolution': '4-8 hours', 'monitoring': '72 hours'}
                        },
                        {
                            'cause': 'Neighbor Relations Issues',
                            'probability': 0.20,
                            'indicators': ['Missing neighbors', 'Handover failures'],
                            'next_actions': [
                                'Audit neighbor list',
                                'Update ANR settings',
                                'Perform drive test'
                            ],
                            'timeline': {'resolution': '2-6 hours', 'monitoring': '24 hours'}
                        }
                    ]
                }
            },
            'Bearer Drop Rate': {
                'thresholds': {'critical': 5, 'major': 2},
                'root_causes': {
                    'high': [
                        {
                            'cause': 'Handover Failures',
                            'probability': 0.40,
                            'indicators': ['High HO failure rate', 'Coverage gaps'],
                            'next_actions': [
                                'Optimize handover parameters',
                                'Check neighbor configuration',
                                'Perform coverage analysis'
                            ],
                            'timeline': {'resolution': '2-4 hours', 'monitoring': '48 hours'}
                        },
                        {
                            'cause': 'Poor Radio Conditions',
                            'probability': 0.30,
                            'indicators': ['Low RSRP/RSRQ', 'High interference'],
                            'next_actions': [
                                'Check RF conditions',
                                'Optimize antenna settings',
                                'Investigate interference'
                            ],
                            'timeline': {'resolution': '4-12 hours', 'monitoring': '1 week'}
                        }
                    ]
                }
            },
            'RSRP (dBm)': {
                'thresholds': {'critical': -110, 'major': -100},
                'reverse_logic': True,  # Lower values are worse
                'root_causes': {
                    'high': [
                        {
                            'cause': 'Coverage Gap',
                            'probability': 0.35,
                            'indicators': ['Distance from cell', 'Terrain obstacles'],
                            'next_actions': [
                                'Plan new site deployment',
                                'Optimize antenna patterns',
                                'Consider small cells'
                            ],
                            'timeline': {'resolution': '1-4 weeks', 'monitoring': '1 month'}
                        },
                        {
                            'cause': 'Antenna/RF Issues',
                            'probability': 0.25,
                            'indicators': ['Antenna misalignment', 'Feeder issues'],
                            'next_actions': [
                                'Check antenna alignment',
                                'Test RF components',
                                'Schedule maintenance'
                            ],
                            'timeline': {'resolution': '4-12 hours', 'monitoring': '1 week'}
                        }
                    ]
                }
            }
        }

    def analyze_kpi(self, site_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Perform comprehensive RCA on a site's KPI data
        """
        kpi_type = site_data.get('kpi')
        value = site_data.get('value')
        
        if kpi_type not in self.rca_rules:
            return self._generic_analysis(site_data)
        
        rules = self.rca_rules[kpi_type]
        severity = self._determine_severity(value, rules)
        root_causes = self._identify_root_causes(severity, rules)
        impact_assessment = self._assess_impact(site_data, severity)
        
        return {
            'site': site_data,
            'analysis_timestamp': datetime.now().isoformat(),
            'severity': severity,
            'confidence': self._calculate_confidence(site_data, root_causes),
            'root_causes': root_causes,
            'impact_assessment': impact_assessment,
            'estimated_users_affected': self._estimate_affected_users(site_data, severity),
            'business_impact': self._calculate_business_impact(severity),
            'recommendations': self._generate_recommendations(root_causes),
            'auto_actions': self._suggest_auto_actions(severity, root_causes)
        }

    def _determine_severity(self, value: float, rules: Dict) -> str:
        """Determine severity level based on thresholds"""
        thresholds = rules['thresholds']
        reverse_logic = rules.get('reverse_logic', False)
        
        if reverse_logic:
            # For metrics where lower values are worse (RSRP, RSRQ, etc.)
            if value < thresholds['critical']:
                return 'critical'
            elif value < thresholds['major']:
                return 'major'
            else:
                return 'minor'
        else:
            # For metrics where higher values are worse (failure rates, etc.)
            if value > thresholds['critical']:
                return 'critical'
            elif value > thresholds['major']:
                return 'major'
            else:
                return 'minor'

    def _identify_root_causes(self, severity: str, rules: Dict) -> List[Dict]:
        """Identify most probable root causes"""
        cause_level = 'high' if severity in ['critical', 'major'] else 'moderate'
        causes = rules['root_causes'].get(cause_level, rules['root_causes'].get('high', []))
        
        # Sort by probability and add confidence scores
        for cause in causes:
            cause['confidence_score'] = self._calculate_cause_confidence(cause)
        
        return sorted(causes, key=lambda x: x['probability'], reverse=True)

    def _assess_impact(self, site_data: Dict, severity: str) -> Dict:
        """Assess the impact of the KPI degradation"""
        kpi_type = site_data.get('kpi')
        
        impact_map = {
            'RRC Setup Failure Rate': {
                'critical': 'Users cannot connect - service unavailable',
                'major': 'Connection delays - poor user experience',
                'minor': 'Occasional connection issues'
            },
            'Bearer Drop Rate': {
                'critical': 'Frequent call drops - severe service degradation',
                'major': 'Intermittent drops - reduced reliability',
                'minor': 'Rare connection interruptions'
            },
            'RSRP (dBm)': {
                'critical': 'No coverage - service unavailable',
                'major': 'Poor signal - degraded performance',
                'minor': 'Weak signal - minor quality issues'
            }
        }
        
        user_experience = impact_map.get(kpi_type, {}).get(severity, 'Unknown impact')
        
        return {
            'user_experience': user_experience,
            'service_availability': self._calculate_availability_impact(severity),
            'revenue_risk': self._calculate_revenue_risk(severity),
            'customer_satisfaction_risk': self._calculate_satisfaction_risk(severity)
        }

    def _estimate_affected_users(self, site_data: Dict, severity: str) -> int:
        """Estimate number of affected users"""
        base_users = 1000  # Assume 1000 users per sector
        severity_multiplier = {'critical': 0.8, 'major': 0.5, 'minor': 0.2}
        return int(base_users * severity_multiplier.get(severity, 0.2))

    def _calculate_business_impact(self, severity: str) -> Dict:
        """Calculate business metrics impact"""
        multipliers = {'critical': 3, 'major': 2, 'minor': 1}
        base_impact = multipliers[severity]
        
        return {
            'revenue_risk_percent': base_impact * 15,
            'customer_satisfaction_impact': base_impact * 20,
            'churn_risk_percent': base_impact * 5,
            'competitive_risk': 'High' if severity == 'critical' else 'Medium' if severity == 'major' else 'Low'
        }

    def _generate_recommendations(self, root_causes: List[Dict]) -> List[Dict]:
        """Generate prioritized recommendations"""
        recommendations = []
        
        for i, cause in enumerate(root_causes[:3]):  # Top 3 causes
            for j, action in enumerate(cause['next_actions'][:2]):  # Top 2 actions per cause
                recommendations.append({
                    'id': f"rec_{i}_{j}",
                    'priority': 'high' if i == 0 else 'medium' if i == 1 else 'low',
                    'action': action,
                    'root_cause': cause['cause'],
                    'estimated_effort': self._estimate_effort(action),
                    'success_probability': cause['probability'] * 0.8,
                    'timeline': cause.get('timeline', {'resolution': '2-4 hours', 'monitoring': '24 hours'})
                })
        
        return recommendations

    def _suggest_auto_actions(self, severity: str, root_causes: List[Dict]) -> List[Dict]:
        """Suggest actions that can be automated"""
        auto_actions = []
        
        if severity == 'critical':
            auto_actions.append({
                'action': 'Enable enhanced monitoring',
                'description': 'Automatically increase monitoring frequency',
                'automation_level': 'full',
                'risk_level': 'low'
            })
        
        if root_causes:
            primary_cause = root_causes[0]['cause']
            if 'monitoring' in primary_cause.lower() or 'configuration' in primary_cause.lower():
                auto_actions.append({
                    'action': 'Configuration audit',
                    'description': 'Automatically check configuration parameters',
                    'automation_level': 'full',
                    'risk_level': 'low'
                })
        
        return auto_actions

    def _calculate_confidence(self, site_data: Dict, root_causes: List[Dict]) -> float:
        """Calculate overall confidence in the analysis"""
        base_confidence = 0.7
        
        # Increase confidence based on data quality
        if site_data.get('sectorInfo'):
            base_confidence += 0.1
        
        if len(root_causes) > 0:
            base_confidence += 0.1
        
        if site_data.get('severity', 0) > 2:
            base_confidence += 0.05
        
        return min(base_confidence, 0.95)

    def _calculate_cause_confidence(self, cause: Dict) -> float:
        """Calculate confidence for individual root cause"""
        return min(cause['probability'] * 1.2, 0.95)

    def _calculate_availability_impact(self, severity: str) -> str:
        impact_map = {
            'critical': 'Service unavailable (0-20% availability)',
            'major': 'Severely degraded (20-60% availability)', 
            'minor': 'Minor impact (60-90% availability)'
        }
        return impact_map.get(severity, 'Unknown')

    def _calculate_revenue_risk(self, severity: str) -> str:
        risk_map = {
            'critical': 'High (potential revenue loss 30-50%)',
            'major': 'Medium (potential revenue loss 10-30%)',
            'minor': 'Low (potential revenue loss 0-10%)'
        }
        return risk_map.get(severity, 'Unknown')

    def _calculate_satisfaction_risk(self, severity: str) -> str:
        risk_map = {
            'critical': 'Severe customer dissatisfaction expected',
            'major': 'Moderate customer impact',
            'minor': 'Minor customer experience degradation'
        }
        return risk_map.get(severity, 'Unknown')

    def _estimate_effort(self, action: str) -> str:
        """Estimate effort required for an action"""
        if any(word in action.lower() for word in ['check', 'monitor', 'review']):
            return 'Low (1-2 hours)'
        elif any(word in action.lower() for word in ['optimize', 'configure', 'update']):
            return 'Medium (4-8 hours)'
        elif any(word in action.lower() for word in ['deploy', 'install', 'replace']):
            return 'High (1-2 days)'
        else:
            return 'Medium (4-8 hours)'

    def _generic_analysis(self, site_data: Dict) -> Dict:
        """Fallback analysis for unknown KPI types"""
        return {
            'site': site_data,
            'analysis_timestamp': datetime.now().isoformat(),
            'severity': 'minor',
            'confidence': 0.6,
            'root_causes': [{
                'cause': 'KPI Threshold Exceeded',
                'probability': 0.5,
                'indicators': ['Metric above normal range'],
                'next_actions': ['Monitor trend', 'Investigate further'],
                'confidence_score': 0.5
            }],
            'impact_assessment': {
                'user_experience': 'Potential service degradation',
                'service_availability': 'Monitoring required',
                'revenue_risk': 'Low risk',
                'customer_satisfaction_risk': 'Monitor for trends'
            },
            'estimated_users_affected': 100,
            'business_impact': {
                'revenue_risk_percent': 5,
                'customer_satisfaction_impact': 10,
                'churn_risk_percent': 2,
                'competitive_risk': 'Low'
            },
            'recommendations': [],
            'auto_actions': []
        }

# Singleton instance
rca_engine = NetworkRCAEngine()

def perform_rca_analysis(site_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Main function to perform RCA analysis
    """
    return rca_engine.analyze_kpi(site_data)

def get_rca_summary(site_ids: List[str]) -> Dict[str, Any]:
    """
    Get RCA summary for multiple sites
    """
    # This would typically fetch data from database
    # For now, return mock summary
    return {
        'total_sites': len(site_ids),
        'critical_issues': random.randint(0, len(site_ids) // 3),
        'major_issues': random.randint(0, len(site_ids) // 2),
        'auto_resolvable': random.randint(0, len(site_ids) // 4),
        'estimated_resolution_time': '2-8 hours',
        'confidence_avg': 0.82
    }
