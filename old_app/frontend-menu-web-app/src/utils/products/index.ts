import { ProductsType } from '../../types/index';
import {local} from '..'

// const object = {
//     orderCreated: {title: 'Your order has been made!', desc: <>You will be notified when <br/>we will confirm it. Please wait</>},
//     welcome: {title: 'Welcome to Terra!',
//         desc:
//         <>
//             We're a small local service focusing on quality and honesty over everything
//             <br/> <br/>
//             Too many websites say AAAA when it's AA, 30% when it's 15%, whole plant extract
//             when it's just shake and stem extract. We promise to be forward about all of
//             this and not lie. You'll know what we know.
//             <br/> <br/>
//             Feel free to browse around using the Menu button.
//             <br/> <br/>
//             If something isn't up to your standards, have any questions, suggestions,
//             feedback, or wanna just send pictures of dogs licking windows, contact
//             Customer Service.
//             <br/> <br/>
//             10 out of 10 you'll get me, Travis 🙂
//             <br/> <br/> <br/>
//             Send this link to your friend
//
//         </>}
//
// }

const descriptionOdbj = {
    Buds: 'We support local producers as much as possible while maintaining relationships with craft growers in other provinces to satisfy our need for a wide range of variety in our product lineup. Much of our flower is tested for potency and the results are listed when available. With so many variables between each grow, we will NEVER post percentages found online like many others in the legacy market. Mama always said, honesty is the best policy.',
    Mushrooms: `During a psilocybin experience, you can expect perceptual changes, emotional shifts, and a distorted
                sense of time.You may experience vivid colors, tracers, distorted vision, and a sense of the world
                breathing around you. Thoughts and emotions can change, too. It’s not uncommon to have a sense of
                openness to thoughts and feelings that you avoid in your everyday life, as well as a sense of wonder
                and delight with the world around you, the people in your life, and your own mind. You may also feel
                a sense of peace and connection with the world. Watch this video or read up on this link for a
                deeper understanding on medicinal benefits!`,
    Extracts: 'All the extracts we have',
    Shatter:    `A brittle, glasslike cannabis extract with a tendency to snap when handled. Shatter is named for its
                breakability, like broken glass, and is favored for its ease in handling while dabbing. It requires
                long, delicate purging cycles to properly remove all solvents used in the manufacturing process.`,
    Budder: `Budder refers to cannabis extracts with a creamy, buttery consistency. It is also called crumble or
             cake batter. The consistency is comparable to soft wax and is much more forgiving to work with than shatter.`,
    Edibles: 'Edible products',
    Chocolates:'Our chocolate bars are made in house using chocolates and ingredients from a well respected chocolatiers shop in the city.',
    Gummies: 'Our gummies use 95% organic ingredients, natural spring water and full spectrum distillate for a great taste.',
    'Microdose Mushrooms': 'Each bottle will contains pills of different types of mushrooms. The reason is so your body doesn\'t build a tolerance to a specific strain of mushroom. One pill might be Thai, another could be Smurfs, and so on.',
    'Whole Mushrooms': 'Much like cannabis, there is much diversity in the potency and effects of psilocybin mushrooms. We do our best to stock a wide range of strains to meet the desired experiences of our customers. Please read the descriptions listed blow each strain and select the schrooms that you are in the mood for.',
    'Mushroom Edibles': 'Our chocolate bars are made in house using chocolates and ingredients from a well respected chocolatiers shop in the city.',
    'Vape products':'Our vape products only use natural ingredients. No MCT, PG, VG, VEA. We use terpenes for flavoring, a dash of full spectrum extract for custom effects, and 99% THC distillate.',
    Cartridges:'These full ceramic cartridges are incredibly durable and provide consistant flavour from the first to the last puff. With a bomb proof quartz glass tube, ceramic inner heating element, and only 3 natural ingredients (distillate, rosin and terpenes), they truly are the best cartridges money can buy. Unlike 1 ml cartridges that have a tendency to lose their flavour and clog up from ultra thick oils like ours, we chose to go with 0.5 ml cartridges to enhance the experience for our customer start to finish.',
    Devices: 'These devices have withstood the test of time and will be delivering superior smoking for a long time. Able to preheat, multiple heat functions and an easy 1 button design.',
    'Starter Kit': 'If you\'re just starting out and need a cart and a device. Get a starter kit for a cheaper price than getting both separate.',
    'RSO': `A highly concentrated, whole plant, full spectrum, high terpene extract. It is highly potent and can
                    be used recreationally for a beautiful full body full mind high. RSO was created by Rick Simpson in
                    2003 to combat his cancer. Eat it or smoke it.`,
    'Live Resin': `Live resin captures the aromas and flavors present in the living plant immediately after harvest,
                    many of which would be lost in the curing process. Sugary live resin consistencies are visually
                    appealing, easy to work with, and contain high levels of terpenes. However, due to the specialty
                    nature of extracts derived from fresh frozen plant material, live resin is typically the most
                    expensive form of BHO concentrate.`,
    '99% THC Distillate': `The main benefit is that by removing virtually everything except for the THC, the final product is
                    incredibly potent. For that reason, a THC distillate will get you very high, as the resulting oil is
                    99.9% THC.`,
    '99% CBD': `The main benefit is that by removing virtually everything except for the THC, the final product is
                    incredibly potent. For that reason, a THC distillate will get you very high, as the resulting oil is
                    99.9% THC.`
                  
} as {[key: string]: string}

export const productsSelector = {
    filterProducts: function (products: ProductsType[], group: string) {
        const settings = local.getUserSettings()
        let res = products.filter(item => item.group === group).filter(el => el.active !== false && el.available > 0);
        // console.log(Array.from(new Set(products.map(prd => prd.cost))));
        // console.log('responseMy:',res)
        if (!settings) return res

        
        if (settings?.costs) {
            // console.log('cost');
            // const defaullt = settings?.costs[0] === settings?.costs[1] ? []
            console.log('settings.costs[0]:',settings.costs[0]);
            console.log('settings.costs[1]:',settings.costs[1]);
            // res = res.filter(prod => prod.cost >= settings.costs[0] && prod.cost <= settings.costs[1]);
            res = res.filter(prod => {
                if(settings.costs[0] === 0 && settings.costs[1] === 100) {
                    return prod.price_tag
                }
                if(settings.costs[0] === 50 && settings.costs[1] === 100) {
                    return (prod.price_tag !== '$')
                }
                if(settings.costs[0] === 100 && settings.costs[1] === 100) {
                    return prod.price_tag === '$$$'
                }
                if(settings.costs[0] === 50 && settings.costs[1] === 50) {
                    return prod.price_tag === '$$'
                }
                if(settings.costs[0] === 0 && settings.costs[1] === 50) {
                    return prod.price_tag !== '$$$'
                }
            });

        }
        if (settings?.lso && group === 'Buds') {
            //console.log('lso');
            res = res.filter(prod => prod.category === 'LSO');
        }
        // if (settings?.lso && group === 'Buds') {
        //     console.log('lso');
        //     res = res.filter(prod => prod.lso);
        // }
        if (settings?.effects && settings?.effects.length) {

            // @ts-ignore
            // res = res.filter(  i => i.top_effect === 'Creative' );
            res = res.filter(prod => settings.effects.includes(prod.top_effect.toLowerCase()));
            // console.log(settings)
        }
        res  = res.sort((a, b) => {
            if (a.price_tag.length > b.price_tag.length) {
                return 1;
            }

            if (a.price_tag.length < b.price_tag.length) {
                return -1;
            }
            return 0;
        })
        console.log('products_filter:', res)
        return res;
    },
    description: function (group: string) {
        // console.log('des',descriptionOdbj[group]);
        const desc = descriptionOdbj[group]
        return desc && desc
    }
   
}

export default productsSelector;