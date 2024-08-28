import requests
import os
from dotenv import load_dotenv

load_dotenv()

AIRBYTE_API_URL = os.getenv('AIRBYTE_API_URL')
AIRBYTE_USERNAME = os.getenv('AIRBYTE_USERNAME')
AIRBYTE_PASSWORD = os.getenv('AIRBYTE_PASSWORD')

def get_airbyte_auth():
    return (AIRBYTE_USERNAME, AIRBYTE_PASSWORD)

def create_trello_card(idea):
    endpoint = f"{AIRBYTE_API_URL}/v1/destinations/trello/cards"
    payload = {
        "name": idea.title,
        "desc": f"Description: {idea.description}\nAuthor: {idea.main_author.username}\nID: {idea.id}",
        "idList": os.getenv('TRELLO_LIST_ID')
    }
    response = requests.post(endpoint, json=payload, auth=get_airbyte_auth())
    if response.status_code == 200:
        return response.json().get('shortUrl')
    else:
        print(f"Error creating Trello card: {response.text}")
        return None

def send_slack_notification(message):
    endpoint = f"{AIRBYTE_API_URL}/v1/destinations/slack/messages"
    payload = {
        "channel": os.getenv('SLACK_CHANNEL_ID'),
        "text": message
    }
    response = requests.post(endpoint, json=payload, auth=get_airbyte_auth())
    if response.status_code == 200:
        return response.json().get('ts')
    else:
        print(f"Error sending Slack message: {response.text}")
        return None