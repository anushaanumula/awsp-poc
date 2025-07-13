from flask import Flask, jsonify, request
from flask_cors import CORS

from intent_parser import extract_intent
from kpi_engine import get_kpi_data
from rca_engine import perform_rca_analysis, get_rca_summary

app = Flask(__name__)
CORS(app)


@app.route('/assistant/prompt-query', methods=['POST'])
def prompt_query():
    data = request.get_json(force=True)
    prompt = data.get('prompt', '')
    intent = extract_intent(prompt)
    result = get_kpi_data(intent)
    return jsonify(result)


@app.route('/rca/analyze', methods=['POST'])
def rca_analyze():
    """Perform Root Cause Analysis on site KPI data"""
    data = request.get_json(force=True)
    site_data = data.get('site', {})
    
    if not site_data:
        return jsonify({'error': 'Site data is required'}), 400
    
    try:
        analysis = perform_rca_analysis(site_data)
        return jsonify(analysis)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/rca/summary', methods=['POST'])
def rca_summary():
    """Get RCA summary for multiple sites"""
    data = request.get_json(force=True)
    site_ids = data.get('site_ids', [])
    
    try:
        summary = get_rca_summary(site_ids)
        return jsonify(summary)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/recommendations/next-best-action', methods=['POST'])
def next_best_action():
    """Get next best action recommendations"""
    data = request.get_json(force=True)
    site_data = data.get('site', {})
    context = data.get('context', {})
    
    if not site_data:
        return jsonify({'error': 'Site data is required'}), 400
    
    try:
        # Perform RCA first to get recommendations
        analysis = perform_rca_analysis(site_data)
        
        # Format as next best action response
        recommendations = analysis.get('recommendations', [])
        auto_actions = analysis.get('auto_actions', [])
        
        response = {
            'site_id': site_data.get('id'),
            'timestamp': analysis.get('analysis_timestamp'),
            'primary_recommendation': recommendations[0] if recommendations else None,
            'alternative_actions': recommendations[1:3] if len(recommendations) > 1 else [],
            'automated_actions': auto_actions,
            'confidence': analysis.get('confidence'),
            'expected_impact': {
                'resolution_time': recommendations[0].get('timeline', {}).get('resolution') if recommendations else 'Unknown',
                'success_probability': recommendations[0].get('success_probability') if recommendations else 0.5,
                'effort_required': recommendations[0].get('estimated_effort') if recommendations else 'Unknown'
            },
            'risk_assessment': {
                'severity': analysis.get('severity'),
                'affected_users': analysis.get('estimated_users_affected'),
                'business_impact': analysis.get('business_impact')
            }
        }
        
        return jsonify(response)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'services': {
            'rca_engine': 'active',
            'kpi_engine': 'active',
            'intent_parser': 'active'
        }
    })


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
