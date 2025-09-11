import random
from seeds.movies_data import MOVIES_SEED
from seeds.critics_data import CRITICS_SEED

CONTENT = """
    Lorem markdownum priores iactate receptus margine in motu ferreus pastor. Teneat
    tua opifex regina, adest; similisque nec, me convivia ortus.

    Est sontes praemia fatorum diversosque innubere rursus. Tanto inter commenta
    tremulasque tergo donec Apollinei mearum: Hector colorum horruit.

    > Cur repulsa matrem frequentes parvum coniuge ad nisi leto, ira. Orbis levatus
    > o coniugis longis confinia *bello* rursus quem Atridae indulgere! Sanguine o
    > operi flammas sorores suffundit et ilia. Nais edentem tamen. Acta munera enixa
    > ad terram!

    Sint sed per oppugnant Medusae Pagasaeae undique rebus cernit terram delituit
    dilapsa tigres. Ait omne conatur nomen cumque, ad Minoa magna *dolentes*,
    ageret. Sum addat, et unum iunge, aberant his indigenae facundia?

    > Perdidit astra, si maternis sibi, Phoebi protinus senecta digitos. Atque
    > suique **Lyrnesia**, prosunt suae mihi aqua, te!

    Subsedit tantaque vulnera totiens aptos vivit digna pectoraque mutua. Duro ante
    tibi perhorruit praedelassat simulat turis loco hunc dederat viscera scilicet
    transitus quam longius aenea, concussaque hoc mille.

    Ut erat. Tibi Themin corpore saepes.
"""

def generate_reviews(critics, movies):
    reviews = []
    review_id = 1
    for movie in movies:
        for critic in critics:
            reviews.append({
                "review_id": review_id,
                "content": CONTENT,
                "score": random.randint(1, 5),
                "critic_id": critic["critic_id"],
                "movie_id": movie["movie_id"],
            })
            review_id += 1
    return reviews

REVIEWS_SEED = generate_reviews(CRITICS_SEED, MOVIES_SEED)