# Création de KG à partir des registres du cadastre napoléonien

## Requirements
- sqlite-connector


## VENV (dans home)
. .venv/bin/activate


## Mistral
```python
%pip install transformers huggingface_hub torch accelerate bitsandbytes>0.37.0 pandas mistral-common
```

Ressources :
* https://github.com/mistralai/mistral-common?tab=readme-ov-file