import os
import glob
import json
import requests
import urllib.parse as up
from rdflib import Graph, Namespace, Literal, BNode, URIRef
from rdflib.namespace import RDF


def get_repositories(graphdb_host):
    url = f"{graphdb_host}/rest/repositories"
    response = requests.request("GET", url)
    print(url)
    return response

def set_default_repository(graphdb_host,repository):
    json_data = {
        'repository': repository,
    }
    headers = {
        'Content-Type': 'application/json'
    }
    response = requests.post(f'{graphdb_host}/rest/locations/active/default-repository', headers=headers, json=json_data)
    return response

def load_onto_into_named_graphs(GRAPHDB_HOST,GRAPHDB_REPO,ONTOLOGY_PATH,ONTOLOGY_MODULES):
    #request headers
    headers = {
        'Content-Type': 'application/x-turtle',
    }
    #curl url
    url = f"{GRAPHDB_HOST}/repositories/{GRAPHDB_REPO}/statements"
    named_graph = "http://data.ign.fr/ontology"
    final_url = url + "?context=" + up.quote(URIRef(named_graph).n3())
    for m in ONTOLOGY_MODULES:
        m_path = ONTOLOGY_PATH + m
        with open(m_path, 'rb') as f:
            data = f.read()
        response = requests.post(final_url, headers=headers, data=data)
        response

def load_ttl_into_named_graphs(GRAPHDB_HOST,GRAPHDB_REPO,TTL_PATH):
    #request headers
    headers = {
        'Content-Type': 'application/x-turtle',
    }

    #curl url
    url = f"{GRAPHDB_HOST}/repositories/{GRAPHDB_REPO}/statements"

    #files
    turtles = glob.glob(TTL_PATH + '/*.ttl')
    for elem in turtles:
        print(elem)
        named_graph = ""
        if 'source' in elem:
            named_graph = "http://data.ign.fr/sources_and_owners/"
        elif 'owner' in elem:
            named_graph = "http://data.ign.fr/sources_and_owners/"
        elif 'initial' in elem:
            named_graph = "http://data.ign.fr/plots/frommaps/"
        elif 'mentions' in elem:
            named_graph = "http://data.ign.fr/plots/fromregisters/"
        elif 'activities' in elem:
            named_graph = "http://data.ign.fr/ontology"
        elif 'landmarks' in elem:
            named_graph = "http://data.ign.fr/otherslandmarks"

        encoded_named_graph_uri = up.quote(URIRef(named_graph).n3())

        with open(elem, 'rb') as f:
            data = f.read()

        final_url = url + "?context=" + encoded_named_graph_uri
        response = requests.post(final_url, headers=headers, data=data)
        response

def remove_named_graphs(GRAPHDB_HOST,GRAPHDB_REPO,NAMED_GRAPHS):
    #Delete all named graphs from a NAMED_GRAPHS list in a given GRAPHDB_REPO
    
    headers = {
        'Content-Type': 'application/x-turtle',
    }

    url = f"{GRAPHDB_HOST}/repositories/{GRAPHDB_REPO}/statements"

    for g in NAMED_GRAPHS:
        final_url = url + "?context=" + up.quote(URIRef(g).n3())
        response = requests.request("DELETE", final_url, headers=headers)
        response

def post_sparql_query(GRAPHDB_HOST,GRAPHDB_REPO,QUERY):
  url = f"{GRAPHDB_HOST}/repositories/{GRAPHDB_REPO}/statements"
  query_encoded = up.quote(query)
  response = requests.request("POST", url, data=f"update={query_encoded}", headers={'Content-Type': 'application/x-www-form-urlencoded'})
  print(response, response.text)